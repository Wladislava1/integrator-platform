"use client";

import { FormEvent, useMemo, useState } from "react";
import { FaAddressCard } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import type { Gender, PublicUser } from "@/lib/types";

function initials(user: PublicUser) {
  const a = user.lastName?.[0] ?? "";
  const b = user.firstName?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

function formatBirth(iso: string) {
  if (!iso) return "—";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}.${m[2]}.${m[1]}`;
  return iso;
}

function genderLabel(g: Gender) {
  if (g === "male") return "Мужской";
  if (g === "female") return "Женский";
  return "—";
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="field-label">{label}</div>
      <div className="field-value">{value || "—"}</div>
    </div>
  );
}

export function ProfilePage({ user }: { user: PublicUser }) {
  const [data, setData] = useState(user);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    lastName: user.lastName,
    firstName: user.firstName,
    middleName: user.middleName,
    phone: user.phone,
    gender: user.gender,
    address: user.address,
    birthDate: user.birthDate,
  });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwd, setPwd] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const avatar = useMemo(() => initials(data), [data]);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setProfileMsg("");
    setProfileErr("");
    setProfileLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await response.json();
      if (!response.ok) {
        setProfileErr(json.error ?? "Ошибка сохранения");
        return;
      }
      setData(json.user);
      setEditing(false);
      setProfileMsg("Профиль сохранён");
    } catch {
      setProfileErr("Сеть недоступна");
    } finally {
      setProfileLoading(false);
    }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setPwdMsg("");
    setPwdErr("");
    setPwdLoading(true);
    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pwd),
      });
      const json = await response.json();
      if (!response.ok) {
        setPwdErr(json.error ?? "Не удалось сменить пароль");
        return;
      }
      setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwdMsg("Пароль изменён");
    } catch {
      setPwdErr("Сеть недоступна");
    } finally {
      setPwdLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside>
          <div className="lk-card flex items-center gap-3">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
              style={{ background: "linear-gradient(145deg, var(--brand), var(--brand-strong))" }}
            >
              {avatar}
            </div>
            <div className="min-w-0">
              <div className="truncate font-semibold">{data.fullName || "Без имени"}</div>
              <div className="text-sm text-[var(--muted)]">Физическое лицо</div>
            </div>
          </div>
        </aside>

        <section className="lk-card space-y-5">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ background: "var(--brand)" }}
              aria-hidden
            >
              <FaAddressCard size={16} />
            </span>
            <h2 className="text-xl font-semibold leading-8 text-[var(--brand-strong)]">
              Личные данные
            </h2>
          </div>

          {!editing ? (
            <>
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-4">
                <Field label="Email" value={data.email} />
                <Field label="Дата рождения" value={formatBirth(data.birthDate)} />
                <Field label="Телефон" value={data.phone} />
                <Field label="Пол" value={genderLabel(data.gender)} />
                <div className="md:col-span-2 lg:col-span-2">
                  <Field label="Адрес" value={data.address} />
                </div>
              </div>
              {profileMsg ? (
                <p className="text-sm text-[var(--brand-strong)]">{profileMsg}</p>
              ) : null}
              <button type="button" className="btn-primary" onClick={() => setEditing(true)}>
                Редактировать
              </button>
            </>
          ) : (
            <form className="space-y-4" onSubmit={saveProfile}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="space-y-1.5">
                  <span className="field-label">Фамилия *</span>
                  <input
                    className="input-field"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    required
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="field-label">Имя *</span>
                  <input
                    className="input-field"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    required
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="field-label">Отчество</span>
                  <input
                    className="input-field"
                    value={form.middleName}
                    onChange={(e) => setForm({ ...form, middleName: e.target.value })}
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="space-y-1.5">
                  <span className="field-label">Email *</span>
                  <input className="input-field" value={data.email} disabled />
                </label>
                <label className="space-y-1.5">
                  <span className="field-label">Телефон</span>
                  <input
                    className="input-field"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </label>
                <fieldset className="space-y-1.5">
                  <legend className="field-label">Пол *</legend>
                  <div className="flex gap-4 pt-2">
                    {(
                      [
                        ["male", "Мужской"],
                        ["female", "Женский"],
                      ] as const
                    ).map(([value, label]) => (
                      <label key={value} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="gender"
                          checked={form.gender === value}
                          onChange={() => setForm({ ...form, gender: value })}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="field-label">Адрес</span>
                  <input
                    className="input-field"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="field-label">Дата рождения</span>
                  <input
                    className="input-field"
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  />
                </label>
              </div>
              {profileErr ? <p className="text-sm text-[var(--danger)]">{profileErr}</p> : null}
              <div className="flex flex-wrap gap-2">
                <button className="btn-primary" type="submit" disabled={profileLoading}>
                  {profileLoading ? "Сохраняем…" : "Сохранить"}
                </button>
                <button
                  type="button"
                  className="rounded-[10px] border border-[var(--border)] px-4 py-2.5 text-sm"
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      lastName: data.lastName,
                      firstName: data.firstName,
                      middleName: data.middleName,
                      phone: data.phone,
                      gender: data.gender,
                      address: data.address,
                      birthDate: data.birthDate,
                    });
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
        </section>
      </div>

      {/* На всю ширину контейнера: от аватара до конца данных */}
      <section className="lk-card space-y-5" id="settings">
        <div className="flex items-start gap-2.5">
          <span
            className="mt-0.5 flex h-[1.75rem] w-[1.75rem] shrink-0 items-center justify-center rounded-md text-white"
            style={{ background: "var(--brand)" }}
            aria-hidden
          >
            <IoSettingsSharp size={14} />
          </span>
          <div className="min-w-0 leading-tight">
            <h2 className="text-xl font-semibold text-[var(--brand-strong)]">Настройки</h2>
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              Управление параметрами аккаунта
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={changePassword}>
          <div className="flex items-center gap-2 text-[var(--brand-strong)]">
            <FaKey size={16} aria-hidden />
            <h3 className="font-semibold">Смена пароля</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="space-y-1.5">
              <span className="field-label">Текущий пароль</span>
              <input
                className="input-field"
                type="password"
                autoComplete="current-password"
                value={pwd.currentPassword}
                onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                required
              />
              <span className="text-xs text-[var(--muted)]">
                Введите текущий пароль для подтверждения
              </span>
            </label>
            <label className="space-y-1.5">
              <span className="field-label">Новый пароль</span>
              <input
                className="input-field"
                type="password"
                autoComplete="new-password"
                value={pwd.newPassword}
                onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                required
              />
              <span className="text-xs text-[var(--muted)]">
                Минимум 8 символов, включая цифры
              </span>
            </label>
            <label className="space-y-1.5">
              <span className="field-label">Подтвердите пароль</span>
              <input
                className="input-field"
                type="password"
                autoComplete="new-password"
                value={pwd.confirmPassword}
                onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })}
                required
              />
              <span className="text-xs text-[var(--muted)]">Повторите новый пароль</span>
            </label>
          </div>
          {pwdErr ? <p className="text-sm text-[var(--danger)]">{pwdErr}</p> : null}
          {pwdMsg ? <p className="text-sm text-[var(--brand-strong)]">{pwdMsg}</p> : null}
          <button className="btn-primary" type="submit" disabled={pwdLoading}>
            {pwdLoading ? "Сохраняем…" : "Сменить пароль"}
          </button>
        </form>
      </section>
    </div>
  );
}
