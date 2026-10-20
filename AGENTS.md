# AGENTS.md — правила проекта RouteMind

Прототип интерфейса (только дизайн + переходы, без реальной маршрутизации).
Язык интерфейса — русский. Отвечать пользователю — кратко, по-русски.

## Стек

- `client/` — React 18 + Vite 5 + React Router 6 + Leaflet (react-leaflet). Порт `5173`.
- `server/` — Node.js + Express (заглушка API). Порт `4000`, все endpoints под `/api`.
- Карта — OpenStreetMap, ключи не нужны. Маршрут — нарисованная демо-линия из `mock.js`.

## Структура

```
client/src/
  App.jsx              — роуты: / (AuthPage), /map (MapPage), /discover (DiscoverPage)
  main.jsx, index.css  — единый файл стилей, CSS-переменные палитры в :root
  components/          — переиспользуемое: icons.jsx (ВСЕ иконки, тонкие SVG-лайн),
                         Logo.jsx, Field.jsx (поле с иконкой), ChipRow.jsx,
                         TopBar.jsx, Rail.jsx, RouteCard.jsx
  hooks/useMapPage.js  — всё состояние MapPage (вкладки, поиск, маршрут, избранное)
  map/                 — вкладки боковой панели: SearchPanel, RoutePanel,
                         CollectionsPanel, ProfilePanel + RouteMap (Leaflet)
  auth/                — AuthForm.jsx (табы, поля, ссылки), AuthPattern.jsx (SVG-узор),
                         AuthContext.jsx (сессия: user/ready/login/register/guest/logout)
  api/client.js        — fetch-клиент: access в Authorization, silent refresh по куке
  discover/            — DiscoverCard.jsx (карточка подборки)
  data/mock.js         — INTEREST_CHIPS, PLACES, COLLECTIONS, DISCOVER_CARDS, DEMO_LINE
  pages/               — тонкие композиции: AuthPage, MapPage, DiscoverPage
server/index.js        — SQLite (data.sqlite) + bcrypt + JWT:
                         /api/register, /api/login, /api/refresh, /api/logout, /api/me,
                         /api/routes (GET/POST, только свои, нужен Bearer),
                         /api/health, /api/build-route (пока демо-ломаная)
```

## Запуск (PowerShell)

```powershell
cd client; npm install; npm run dev      # http://localhost:5173
cd server; npm install; npm start        # http://localhost:4000
```

Vite проксирует `/api` → `localhost:4000` (см. `client/vite.config.js`).
Клиент работает и без сервера (данные из `mock.js`).

## Правила кода

1. **Палитра** (`index.css :root`): `--lime #dff478`, `--cream #fdfbf3`,
   `--sky #92bad5`, `--peri #788ce3`, `--navy #17243f`. Новые цвета не вводить.
2. **Без эмодзи** — ни в JSX, ни в моках. Нужна иконка → добавить в `components/icons.jsx`.
3. **Стили** — только в `client/src/index.css`, классами. Инлайн-стили — минимум.
4. **MapPage — docked layout**: `.app` на `100vh`, панели впритык
   (`.app-topbar` / `.app-rail` / `.app-side` / `.app-map`), без «плавающих» карточек.
   Боковые вкладки: `search | route | collections | profile`.
   Интересы (`INTEREST_CHIPS`) живут ТОЛЬКО во вкладке `route`, дублей не делать.
5. **AuthPage** — fullscreen `auth-form + auth-map`, справа абстрактный SVG-узор
   в палитре (без карт и без подписей мест).
6. **Авторизация настоящая, маршрутизация — мок**: access JWT 15 мин в
   `Authorization: Bearer`, refresh 30 дней в httpOnly-куке `rm_refresh` (ротация).
   Ошибки API — `{ ok: false, error: 'текст' }`, текст показываем в форме как есть.
   `/api/build-route` — пока демо-ломаная. Новые места/подборки — в `mock.js`.
   Секреты — в `server/.env` (образец — `.env.example`), `data.sqlite` в git не идёт.
7. **Маркеры Leaflet** — через `L.Icon` с `unpkg`-URL (см. `MapPage.jsx`), свои картинки не класть.
8. **Проверка** — после правок клиента: `npm run build` в `client/` должен проходить.
9. **Терминал** — Windows PowerShell 5.1: цепочки через `;`, не `&&`; каталог — параметром
   `workdir`, не `cd` внутри команды. Файлы — через Read/Edit/Write, не через shell.
10. **Коммиты/пуши** — только по явной просьбе.
