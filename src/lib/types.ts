export type Theme = "light" | "dark";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  avatarUrl: string | null;
  theme: Theme;
  createdAt: string;
  updatedAt: string;
};

export type PublicUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  theme: Theme;
};

export type SessionPayload = {
  sub: string;
  email: string;
  fullName: string;
};
