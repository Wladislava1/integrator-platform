import type { PublicUser } from "./types";

const API_URL = process.env.LOST_PETS_API_URL ?? "http://127.0.0.1:8000";
const APP_URL = process.env.LOST_PETS_APP_URL ?? "http://localhost:5173";
const SECRET = process.env.SVYAZ_HANDOFF_SECRET ?? "dev-svyaz-lost-pets";

export class LostPetsError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

export type LostPetsProfile = {
  email: string;
  name: string;
  phone: string;
  city: string;
  avatar_url: string | null;
  svyaz_id: string;
};

export function profileFromUser(user: PublicUser): LostPetsProfile {
  return {
    email: user.email,
    name: user.fullName || user.email,
    phone: user.phone,
    city: user.address,
    avatar_url: user.avatarUrl,
    svyaz_id: user.id,
  };
}

export function entryUrl(code: string): string {
  return `${APP_URL}/svyaz?code=${encodeURIComponent(code)}`;
}

async function call(path: string, body: unknown): Promise<{ status: number; data: Record<string, unknown> }> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Svyaz-Secret": SECRET,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new LostPetsError(
      "Потеряшки сейчас недоступны. Запустите приложение и попробуйте ещё раз.",
    );
  }

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: response.status, data };
}

function detail(data: Record<string, unknown>, fallback: string): string {
  return typeof data.detail === "string" ? data.detail : fallback;
}

export async function lookupLostPets(
  email: string,
  svyazId: string,
): Promise<{ found: boolean; email: string }> {
  const { status, data } = await call("/auth/svyaz/lookup", { email, svyaz_id: svyazId });
  if (!status || status >= 500) {
    throw new LostPetsError(detail(data, "Не удалось проверить пользователя в Потеряшках"));
  }
  if (status === 401) throw new LostPetsError("Нет доступа к Потеряшкам", 401);
  if (status >= 400) throw new LostPetsError(detail(data, "Не удалось проверить пользователя в Потеряшках"), status);
  return {
    found: data.found === true,
    email: typeof data.email === "string" && data.email ? data.email : email,
  };
}

export async function openLostPets(profile: LostPetsProfile, create: boolean): Promise<string | null> {
  const { status, data } = await call("/auth/svyaz/session", { ...profile, create });
  if (status === 404) return null;
  if (status >= 400) {
    throw new LostPetsError(detail(data, "Не удалось открыть Потеряшки"), status);
  }
  if (typeof data.code !== "string" || !data.code) {
    throw new LostPetsError("Потеряшки не выдали ссылку для перехода");
  }
  return data.code;
}

export async function linkLostPets(email: string, password: string, svyazId: string): Promise<string> {
  const { status, data } = await call("/auth/svyaz/link", { email, password, svyaz_id: svyazId });
  if (status === 401 || status === 400) {
    throw new LostPetsError(detail(data, "Неверный email или пароль в Потеряшках"), 400);
  }
  if (status >= 400) {
    throw new LostPetsError(detail(data, "Не удалось войти в Потеряшки"), status);
  }
  if (typeof data.code !== "string" || !data.code) {
    throw new LostPetsError("Потеряшки не выдали ссылку для перехода");
  }
  return data.code;
}
