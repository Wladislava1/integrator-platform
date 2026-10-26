/**
 * Smoke-проверка: сервер отвечает, регистрация и вход работают.
 * Запуск: npm run dev (в другом терминале), затем npm run smoke
 */
const base = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";

function fail(message) {
  console.error("SMOKE FAIL:", message);
  process.exit(1);
}

async function main() {
  const stamp = Date.now();
  const email = `smoke_${stamp}@example.com`;
  const password = "smoke-pass-1";
  const fullName = "Smoke Тестов";

  const home = await fetch(base, { redirect: "manual" });
  if (![200, 307, 308].includes(home.status)) {
    fail(`главная вернула ${home.status}`);
  }

  const register = await fetch(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName,
      email,
      password,
      confirmPassword: password,
    }),
  });
  if (register.status !== 201) {
    fail(`register → ${register.status} ${await register.text()}`);
  }
  const setCookie = register.headers.getSetCookie?.() ?? [];
  const cookieHeader = setCookie.map((c) => c.split(";")[0]).join("; ");

  const me = await fetch(`${base}/api/auth/me`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });
  if (!me.ok) fail(`me после register → ${me.status}`);

  await fetch(`${base}/api/auth/logout`, {
    method: "POST",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });

  const login = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!login.ok) fail(`login → ${login.status} ${await login.text()}`);

  console.log("SMOKE OK: register + session + login");
}

main().catch((error) => fail(String(error)));
