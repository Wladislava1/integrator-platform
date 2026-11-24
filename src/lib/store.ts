import { createHash, randomUUID } from "crypto";
import { ensureDb, pool } from "./db";
import { buildFullName, type Gender, type Theme, type User } from "./types";

const USER_SQL = `
  SELECT u.id,
         u.email,
         u.password_hash AS "passwordHash",
         u.last_name AS "lastName",
         u.first_name AS "firstName",
         COALESCE(u.middle_name, '') AS "middleName",
         COALESCE(u.phone, '') AS phone,
         COALESCE(u.gender, '') AS gender,
         COALESCE(u.address, '') AS address,
         COALESCE(to_char(u.birth_date, 'YYYY-MM-DD'), '') AS "birthDate",
         u.avatar_url AS "avatarUrl",
         COALESCE(s.theme, 'light') AS theme,
         u.created_at AS "createdAt",
         u.updated_at AS "updatedAt"
  FROM users u
  LEFT JOIN user_settings s ON s.user_id = u.id
`;

function asUser(row: User): User {
  return {
    ...row,
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
    theme: row.theme === "dark" || row.theme === "auto" ? row.theme : "light",
    gender: row.gender === "male" || row.gender === "female" ? row.gender : "",
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  await ensureDb();
  const result = await pool.query<User>(`${USER_SQL} WHERE lower(u.email) = lower($1)`, [email]);
  return result.rows[0] ? asUser(result.rows[0]) : null;
}

export async function findUserById(id: string): Promise<User | null> {
  await ensureDb();
  const result = await pool.query<User>(`${USER_SQL} WHERE u.id = $1`, [id]);
  return result.rows[0] ? asUser(result.rows[0]) : null;
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  lastName: string;
  firstName: string;
  middleName?: string;
}): Promise<User> {
  await ensureDb();
  const id = randomUUID();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO users (id, email, password_hash, last_name, first_name, middle_name)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        input.email.trim().toLowerCase(),
        input.passwordHash,
        input.lastName.trim(),
        input.firstName.trim(),
        (input.middleName ?? "").trim(),
      ],
    );
    await client.query(`INSERT INTO user_settings (user_id, theme) VALUES ($1, 'light')`, [id]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  const user = await findUserById(id);
  if (!user) throw new Error("USER_NOT_CREATED");
  return user;
}

export async function updateUser(
  id: string,
  patch: Partial<
    Pick<
      User,
      | "lastName"
      | "firstName"
      | "middleName"
      | "email"
      | "phone"
      | "gender"
      | "address"
      | "birthDate"
      | "avatarUrl"
      | "theme"
      | "passwordHash"
    >
  >,
): Promise<User | null> {
  await ensureDb();
  const current = await findUserById(id);
  if (!current) return null;

  if (patch.email) {
    const conflict = await pool.query(
      `SELECT 1 FROM users WHERE id <> $1 AND lower(email) = lower($2)`,
      [id, patch.email],
    );
    if (conflict.rowCount) throw new Error("EMAIL_TAKEN");
  }

  const birth = patch.birthDate !== undefined ? patch.birthDate.trim() : current.birthDate;
  await pool.query(
    `UPDATE users SET
       email = $2,
       password_hash = $3,
       last_name = $4,
       first_name = $5,
       middle_name = $6,
       phone = $7,
       gender = $8,
       address = $9,
       birth_date = $10,
       avatar_url = $11,
       updated_at = NOW()
     WHERE id = $1`,
    [
      id,
      (patch.email ?? current.email).trim().toLowerCase(),
      patch.passwordHash ?? current.passwordHash,
      (patch.lastName ?? current.lastName).trim(),
      (patch.firstName ?? current.firstName).trim(),
      (patch.middleName ?? current.middleName).trim(),
      (patch.phone ?? current.phone).trim(),
      patch.gender ?? current.gender,
      (patch.address ?? current.address).trim(),
      /^\d{4}-\d{2}-\d{2}$/.test(birth) ? birth : null,
      patch.avatarUrl !== undefined ? patch.avatarUrl : current.avatarUrl,
    ],
  );

  if (patch.theme) {
    await pool.query(
      `INSERT INTO user_settings (user_id, theme) VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET theme = EXCLUDED.theme, updated_at = NOW()`,
      [id, patch.theme],
    );
  }

  return findUserById(id);
}

export async function recordSession(userId: string, token: string): Promise<void> {
  await ensureDb();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await pool.query(
    `INSERT INTO sessions (user_id, refresh_token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, createHash("sha256").update(token).digest("hex"), expires.toISOString()],
  );
}

export async function deleteSessionByToken(token: string): Promise<void> {
  await ensureDb();
  await pool.query(`DELETE FROM sessions WHERE refresh_token_hash = $1`, [
    createHash("sha256").update(token).digest("hex"),
  ]);
}

export async function findProductLink(userId: string): Promise<string | null> {
  await ensureDb();
  const result = await pool.query<{ product_email: string }>(
    `SELECT product_email FROM product_links WHERE user_id = $1 AND product_slug = 'poteryashki'`,
    [userId],
  );
  return result.rows[0]?.product_email ?? null;
}

export async function saveProductLink(userId: string, email: string): Promise<void> {
  await ensureDb();
  await pool.query(
    `INSERT INTO product_links (user_id, product_slug, product_email)
     VALUES ($1, 'poteryashki', $2)
     ON CONFLICT (user_id, product_slug) DO UPDATE SET product_email = EXCLUDED.product_email`,
    [userId, email.trim().toLowerCase()],
  );
}

export function toPublicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    lastName: user.lastName,
    firstName: user.firstName,
    middleName: user.middleName,
    fullName: buildFullName(user),
    phone: user.phone,
    gender: user.gender as Gender,
    address: user.address,
    birthDate: user.birthDate,
    avatarUrl: user.avatarUrl,
    theme: user.theme as Theme,
  };
}
