# План рассказа преподу (Lab 1) — Связь ID

## 1. Что это за проект (30–40 сек)

- **Связь ID** — единый вход для физического лица.
- **Платформа интеграций** — каталог, куда позже подключаются другие продукты по API.
- Сейчас этап запуска: каркас, auth, профиль, тема; продукты — заглушки.

Репозиторий: https://github.com/Wladislava1/integrator-platform

## 2. Как показать запуск (1–2 мин)

```bash
cd integrator-platform
cp .env.example .env
npm ci
npm run dev
```

Открыть http://localhost:3000 → регистрация → каталог → профиль.

Проверка: `npm run smoke`  
Swagger для преподу: http://localhost:3000/api-docs

## 3. Как работает вход и авторизация (важно)

Уже есть **HTTP API** (Next.js Route Handlers), не «фейковые кнопки»:

| Метод | Путь | Что делает |
|-------|------|------------|
| POST | `/api/auth/register` | создаёт пользователя, отдаёт JWT в httpOnly cookie |
| POST | `/api/auth/login` | проверяет email/пароль, ставит cookie |
| POST | `/api/auth/logout` | очищает cookie |
| GET | `/api/auth/me` | кто сейчас в сессии |
| PATCH | `/api/profile` | личные данные |
| POST | `/api/profile/password` | смена пароля |
| PATCH | `/api/settings/theme` | тема light/dark/auto |

Технически:
- пароль хешируется **bcrypt**;
- сессия — **JWT** (`jose`) в cookie `svyaz_id_token`;
- хранение Lab 1: локальный файл `.data/users.json` (не Postgres);
- схема будущей БД: `src/db/schema.sql` (таблицы описаны, подключения нет).

Это **внутреннее API платформы**. Внешний API «подключить продукт» — в следующих лабах; в каталоге слоты-заглушки.

## 4. Что где лежит в файлах

| Путь | Зачем |
|------|--------|
| `src/app/login`, `register` | экраны входа/регистрации |
| `src/app/catalog` | каталог продуктов (плейсхолдеры) |
| `src/app/profile` | профиль + настройки пароля |
| `src/app/api/**` | REST endpoints |
| `src/app/api-docs` | Swagger UI |
| `public/openapi.json` | OpenAPI-спека |
| `src/lib/auth.ts` | JWT, cookie, bcrypt |
| `src/lib/store.ts` | чтение/запись пользователей |
| `src/db/schema.sql` | схема Postgres на будущее |
| `docs/00-project.md` | паспорт проекта (Lab 1) |
| `docs/demo-plan.md` | этот план |
| `README.md` | запуск |
| `scripts/smoke.mjs` | автопроверка auth |

## 5. Что сделано по Lab 1 (чек-лист методички)

1. Выбор проекта + паспорт `docs/00-project.md` + issue product  
2. Репозиторий GitHub, структура docs/, LICENSE MIT, labels  
3. Воспроизводимый запуск + README + smoke  
4. Описание структуры, карта функций, issues  
5. Риски и план на семестр в паспорте; ветка/тег `lab-1`

## 6. Порядок демо на защите

1. GitHub: README, `docs/00-project.md`, коммиты от Wladislava1, тег `lab-1`  
2. Локальный запуск → регистрация → каталог → профиль (поля, редактирование, смена пароля) → тема в шапке  
3. Swagger `/api-docs` → показать `POST /api/auth/login`  
4. Сказать честно: Postgres пока только схема; данные в JSON; API продуктов — дальше  

## 7. Чего не говорить / не показывать

- Не упоминать Cursor / AI  
- Не ссылаться на sspb / корпоративный passport  
- Не обещать уже готовый внешний API продуктов — только заглушки + план
