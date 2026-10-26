import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { buildFullName, type Theme, type User, type Gender } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

type StoredUser = User & { fullName?: string };

function splitLegacyFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    lastName: parts[0] ?? "",
    firstName: parts[1] ?? parts[0] ?? "",
    middleName: parts.slice(2).join(" "),
  };
}

function normalizeUser(raw: StoredUser): User {
  if (raw.lastName || raw.firstName) {
    return {
      id: raw.id,
      email: raw.email,
      passwordHash: raw.passwordHash,
      lastName: raw.lastName ?? "",
      firstName: raw.firstName ?? "",
      middleName: raw.middleName ?? "",
      phone: raw.phone ?? "",
      gender: (raw.gender as Gender) ?? "",
      address: raw.address ?? "",
      birthDate: raw.birthDate ?? "",
      avatarUrl: raw.avatarUrl ?? null,
      theme: (raw.theme as Theme) ?? "light",
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
  const split = splitLegacyFullName(raw.fullName ?? "");
  return {
    id: raw.id,
    email: raw.email,
    passwordHash: raw.passwordHash,
    ...split,
    phone: raw.phone ?? "",
    gender: (raw.gender as Gender) ?? "",
    address: raw.address ?? "",
    birthDate: raw.birthDate ?? "",
    avatarUrl: raw.avatarUrl ?? null,
    theme: (raw.theme as Theme) ?? "light",
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

async function ensureStore(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]", "utf8");
  }
}

async function readUsers(): Promise<User[]> {
  await ensureStore();
  const raw = await fs.readFile(USERS_FILE, "utf8");
  const list = JSON.parse(raw) as StoredUser[];
  return list.map(normalizeUser);
}

async function writeUsers(users: User[]): Promise<void> {
  await ensureStore();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  const users = await readUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  lastName: string;
  firstName: string;
  middleName?: string;
}): Promise<User> {
  const users = await readUsers();
  const now = new Date().toISOString();
  const user: User = {
    id: randomUUID(),
    email: input.email.trim().toLowerCase(),
    passwordHash: input.passwordHash,
    lastName: input.lastName.trim(),
    firstName: input.firstName.trim(),
    middleName: (input.middleName ?? "").trim(),
    phone: "",
    gender: "",
    address: "",
    birthDate: "",
    avatarUrl: null,
    theme: "light",
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  await writeUsers(users);
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
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  if (patch.email) {
    const conflict = users.find(
      (u) => u.id !== id && u.email.toLowerCase() === patch.email!.toLowerCase(),
    );
    if (conflict) throw new Error("EMAIL_TAKEN");
  }

  const updated: User = {
    ...users[index],
    ...patch,
    email: patch.email ? patch.email.trim().toLowerCase() : users[index].email,
    lastName: patch.lastName !== undefined ? patch.lastName.trim() : users[index].lastName,
    firstName: patch.firstName !== undefined ? patch.firstName.trim() : users[index].firstName,
    middleName:
      patch.middleName !== undefined ? patch.middleName.trim() : users[index].middleName,
    phone: patch.phone !== undefined ? patch.phone.trim() : users[index].phone,
    address: patch.address !== undefined ? patch.address.trim() : users[index].address,
    birthDate: patch.birthDate !== undefined ? patch.birthDate.trim() : users[index].birthDate,
    updatedAt: new Date().toISOString(),
  };
  users[index] = updated;
  await writeUsers(users);
  return updated;
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
    gender: user.gender,
    address: user.address,
    birthDate: user.birthDate,
    avatarUrl: user.avatarUrl,
    theme: user.theme as Theme,
  };
}
