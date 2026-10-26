import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { Theme, User } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

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
  return JSON.parse(raw) as User[];
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
  fullName: string;
}): Promise<User> {
  const users = await readUsers();
  const now = new Date().toISOString();
  const user: User = {
    id: randomUUID(),
    email: input.email.trim().toLowerCase(),
    passwordHash: input.passwordHash,
    fullName: input.fullName.trim(),
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
  patch: Partial<Pick<User, "fullName" | "email" | "avatarUrl" | "theme">>,
): Promise<User | null> {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  if (patch.email) {
    const conflict = users.find(
      (u) => u.id !== id && u.email.toLowerCase() === patch.email!.toLowerCase(),
    );
    if (conflict) {
      throw new Error("EMAIL_TAKEN");
    }
  }

  const updated: User = {
    ...users[index],
    ...patch,
    email: patch.email ? patch.email.trim().toLowerCase() : users[index].email,
    fullName: patch.fullName ? patch.fullName.trim() : users[index].fullName,
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
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    theme: user.theme as Theme,
  };
}
