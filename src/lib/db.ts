import { readFile, access } from "fs/promises";
import path from "path";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgres://svyaz:svyaz@localhost:5432/svyaz",
});

let ready: Promise<void> | null = null;

export function ensureDb(): Promise<void> {
  if (!ready) ready = setup().catch((error) => {
    ready = null;
    throw error;
  });
  return ready;
}

async function setup(): Promise<void> {
  const schema = await readFile(path.join(process.cwd(), "src/db/schema.sql"), "utf8");
  await pool.query(schema);
  await pool.query(
    `INSERT INTO products (slug, title, description, status)
     VALUES ($1, $2, $3, 'connected')
     ON CONFLICT (slug) DO UPDATE
       SET title = EXCLUDED.title,
           description = EXCLUDED.description,
           status = EXCLUDED.status`,
    [
      "poteryashki",
      "Потеряшки",
      "Объявления о потерянных и найденных животных",
    ],
  );
  await migrateJsonUsers();
}

async function migrateJsonUsers(): Promise<void> {
  const count = await pool.query<{ n: string }>("SELECT COUNT(*)::text AS n FROM users");
  if (count.rows[0]?.n !== "0") return;

  const file = path.join(process.cwd(), ".data", "users.json");
  try {
    await access(file);
  } catch {
    return;
  }

  const raw = JSON.parse(await readFile(file, "utf8")) as Array<Record<string, unknown>>;
  for (const item of raw) {
    const email = String(item.email ?? "").trim().toLowerCase();
    const passwordHash = String(item.passwordHash ?? "");
    if (!email || !passwordHash) continue;
    const names = splitName(item);
    const theme = item.theme === "dark" || item.theme === "auto" ? item.theme : "light";
    const birth = typeof item.birthDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.birthDate)
      ? item.birthDate
      : null;
    const inserted = await pool.query<{ id: string }>(
      `INSERT INTO users (
         id, email, password_hash, last_name, first_name, middle_name,
         phone, gender, address, birth_date, avatar_url, created_at, updated_at
       ) VALUES (
         COALESCE($1::uuid, gen_random_uuid()), $2, $3, $4, $5, $6,
         $7, $8, $9, $10, $11, COALESCE($12::timestamptz, NOW()), COALESCE($13::timestamptz, NOW())
       )
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [
        isUuid(item.id) ? item.id : null,
        email,
        passwordHash,
        names.lastName,
        names.firstName,
        names.middleName,
        String(item.phone ?? ""),
        item.gender === "male" || item.gender === "female" ? item.gender : "",
        String(item.address ?? ""),
        birth,
        typeof item.avatarUrl === "string" ? item.avatarUrl : null,
        typeof item.createdAt === "string" ? item.createdAt : null,
        typeof item.updatedAt === "string" ? item.updatedAt : null,
      ],
    );
    const id = inserted.rows[0]?.id;
    if (!id) continue;
    await pool.query(
      `INSERT INTO user_settings (user_id, theme) VALUES ($1, $2)
       ON CONFLICT (user_id) DO NOTHING`,
      [id, theme],
    );
  }
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function splitName(item: Record<string, unknown>) {
  if (typeof item.lastName === "string" || typeof item.firstName === "string") {
    return {
      lastName: String(item.lastName ?? "").trim(),
      firstName: String(item.firstName ?? "").trim(),
      middleName: String(item.middleName ?? "").trim(),
    };
  }
  const parts = String(item.fullName ?? "").trim().split(/\s+/).filter(Boolean);
  return {
    lastName: parts[0] ?? "",
    firstName: parts[1] ?? parts[0] ?? "",
    middleName: parts.slice(2).join(" "),
  };
}
