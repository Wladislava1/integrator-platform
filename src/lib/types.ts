export type Theme = "light" | "dark" | "auto";
export type Gender = "male" | "female" | "";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  gender: Gender;
  address: string;
  birthDate: string;
  avatarUrl: string | null;
  theme: Theme;
  createdAt: string;
  updatedAt: string;
};

export type PublicUser = {
  id: string;
  email: string;
  lastName: string;
  firstName: string;
  middleName: string;
  fullName: string;
  phone: string;
  gender: Gender;
  address: string;
  birthDate: string;
  avatarUrl: string | null;
  theme: Theme;
};

export type SessionPayload = {
  sub: string;
  email: string;
  fullName: string;
};

export function buildFullName(user: {
  lastName: string;
  firstName: string;
  middleName?: string;
}): string {
  return [user.lastName, user.firstName, user.middleName]
    .map((p) => (p ?? "").trim())
    .filter(Boolean)
    .join(" ");
}
