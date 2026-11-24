import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { entryUrl, linkLostPets, LostPetsError } from "../src/lib/lostPets";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("пример 1: верные почта и пароль дают ссылку перехода", async () => {
  globalThis.fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body)) as { email?: string; password?: string };
    assert.equal(body.email, "petr.pets@example.com");
    assert.equal(body.password, "Pets-26");
    return Response.json({ code: "handoff-code" });
  };

  const code = await linkLostPets(
    "petr.pets@example.com",
    "Pets-26",
    "29632c83-d139-432f-b755-c26169c2795f",
  );

  assert.equal(code, "handoff-code");
  assert.equal(entryUrl(code), "http://localhost:5173/svyaz?code=handoff-code");
});

test("пример 2: неверный пароль возвращает текст ошибки", async () => {
  globalThis.fetch = async () =>
    Response.json({ detail: "Неверный email или пароль в Потеряшках" }, { status: 401 });

  await assert.rejects(
    () => linkLostPets("petr.pets@example.com", "Wrong-00", "29632c83-d139-432f-b755-c26169c2795f"),
    (error: unknown) => {
      assert.ok(error instanceof LostPetsError);
      assert.equal(error.message, "Неверный email или пароль в Потеряшках");
      assert.equal(error.status, 400);
      return true;
    },
  );
});
