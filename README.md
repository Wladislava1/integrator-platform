# Integrator Platform — Связь ID

Платформа единого входа **Связь ID** для физического лица и каталог продуктов.  
Другие продукты подключаются позже через API; в Lab 1 — каркас, регистрация, вход, профиль и тема.

## Стек и версии инструментов

| Инструмент | Версия |
|------------|--------|
| Node.js | ≥ 20 (проверено на 22.17.0) |
| npm | ≥ 10 |
| Next.js | 15.1.0 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 3.4 |

Зависимости зафиксированы в `package-lock.json`.

## Запуск

```bash
git clone https://github.com/Wladislava1/integrator-platform.git
cd integrator-platform
cp .env.example .env
npm ci
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### Проверка работоспособности

1. Откройте `/register`, создайте пользователя.
2. После регистрации откроется каталог со слотами продуктов.
3. Зайдите в «Профиль»: личные данные и смена пароля; тема — в шапке.

Автоматический smoke (сервер должен быть запущен):

```bash
npm run smoke
```

## Скриншоты

| Экран | Файл |
|-------|------|
| Вход | `docs/screenshots/01-login.png` |
| Регистрация | `docs/screenshots/02-register.png` |
| Каталог | `docs/screenshots/03-catalog.png` |
| Профиль | `docs/screenshots/04-profile.png` |
| Настройки в профиле | `docs/screenshots/05-settings.png` |

## Протокол проверки запуска

| Дата | ОС | Кто проверял | Результат |
|------|----|--------------|-----------|
| 2026-10-26 | Windows 10 | Владислава | `npm run dev` + `npm run smoke` — OK |

## Структура

См. [docs/00-project.md](docs/00-project.md).

## Лицензия

MIT
