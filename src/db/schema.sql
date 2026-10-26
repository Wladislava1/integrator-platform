-- Integrator Platform / СвязID
-- Начальная схема PostgreSQL (пустое состояние, без seed-данных).
-- Подключение к БД в Lab 1 не выполняется — только проектирование таблиц.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Физическое лицо: базовая учётная запись единого входа
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    full_name     VARCHAR(255) NOT NULL,
    avatar_url    TEXT,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Сессии / refresh-токены (JWT access живёт в cookie; здесь — серверный след)
CREATE TABLE IF NOT EXISTS sessions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT       NOT NULL,
    expires_at       TIMESTAMPTZ  NOT NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- Карточки продуктов в каталоге (пока заглушки, заполнение — в следующих работах)
CREATE TABLE IF NOT EXISTS products (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(100) NOT NULL UNIQUE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      VARCHAR(32)  NOT NULL DEFAULT 'placeholder',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Настройки пользователя (тема интерфейса и пр.)
CREATE TABLE IF NOT EXISTS user_settings (
    user_id    UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme      VARCHAR(16) NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
