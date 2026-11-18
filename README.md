# RouteMind — маршрут по интересам (прототип интерфейса)

Веб-сервис: пользователь строит пеший маршрут по Красноярску с учётом предпочтений:
**идти в теньке / тихо / безлюдно / людно / самый короткий**.

Палитра: `#dff478` `#f7f3e6` `#92bad5` `#788ce3` `#17243f`.

Пока прототип: интерфейс, авторизация и построение пешего маршрута через OpenRouteService.

## Структура

```
personal-routing/
  client/  — React + TypeScript + Vite + React Router + MapLibre GL (OpenStreetMap)
    src/pages/AuthPage.tsx      — вход / регистрация
    src/pages/MapPage.tsx       — карта + панели + профиль
    src/pages/DiscoverPage.tsx  — подборки (бонус-экран из референса)
    src/data/mock.ts            — мок-данные
  server/  — Node.js + TypeScript + Express (SQLite, JWT, ORS)
```

## Запуск

```powershell
# 1. клиент
cd client
npm install
npm run dev      # http://localhost:5173

# 2. сервер (второе окно терминала)
cd server
npm install
npm start        # http://localhost:4000
```

Авторизация — настоящая: SQLite + bcrypt + JWT (access 15 мин в заголовке,
refresh 30 дней в httpOnly-куке). `/map` и `/discover` требуют входа,
«Продолжить как гость» создаёт одноразовый аккаунт.

Проверка:

- `GET /api/health`
- `POST /api/register` `{name, email, password}` → `{ok, access, user}`
- `POST /api/login` `{email, password}`, `POST /api/refresh` (по куке),
  `POST /api/logout`, `GET /api/me` (нужен `Authorization: Bearer ...`)
- `GET /api/routes`, `POST /api/routes` — только свои маршруты (нужен Bearer)
- `POST /api/build-route` — пеший маршрут через OpenRouteService

## Экраны

1. `/` — Вход/Регистрация: табы, показать пароль, «продолжить как гость», переход на `/map`.
2. `/map` — Карта (MapLibre, OSM, центр — Красноярск):
   - верх: лого, поиск, кружок профиля + бургер → выпадающее меню (разворачивается);
   - слева rail: Карта / Интересы / Маршруты / Профиль — переключают левую панель;
   - панель «Поиск маршрута» (Откуда/Куда) + карточка «Ваш маршрут 2ч40 · 6.8км»;
   - «Интересы»: чипы тень / тихое / безлюдное / людное / короткий;
   - «Маршруты»: избранное с поиском и ★;
   - снизу: «Ваши настройки» — тоглы (ходить по тени, природа, культура, кафе).
3. `/discover` — «Готовы к новым открытиям?» — карточки подборок.

Карта — OpenStreetMap, ключи не нужны. Маршрут строится через OpenRouteService.
