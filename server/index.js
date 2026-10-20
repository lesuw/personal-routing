require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ACCESS_TTL = '15m';
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// ---------- БД ----------
const db = new Database(path.join(__dirname, 'data.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    pass_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    time TEXT NOT NULL DEFAULT '',
    km REAL NOT NULL DEFAULT 0,
    tag TEXT NOT NULL DEFAULT '',
    fav INTEGER NOT NULL DEFAULT 0
  );
`);

const DEMO_ROUTES = [
  { title: 'Смотровые площадки Красноярска', time: '3 ч 20 мин', km: 8.5, tag: 'Природа', fav: 1 },
  { title: 'Бобровый лог и лесные тропы', time: '2 ч 10 мин', km: 5.7, tag: 'Природа', fav: 1 },
  { title: 'Город и набережная', time: '2 ч 50 мин', km: 7.4, tag: 'Комбинированный', fav: 0 }
];

const DEMO_LINE = [
  [56.0097, 92.8525],
  [56.015, 92.86],
  [56.021, 92.875],
  [56.028, 92.89],
  [56.035, 92.905],
  [56.042, 92.92]
];

// ---------- helpers ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(res, code, error) {
  return res.status(code).json({ ok: false, error });
}

function signAccess(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: ACCESS_TTL });
}

function issueRefresh(res, userId) {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ sub: userId, jti }, JWT_SECRET, { expiresIn: '30d' });
  const tokenHash = crypto.createHash('sha256').update(jti).digest('hex');
  db.prepare('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)')
    .run(userId, tokenHash, Date.now() + REFRESH_TTL_MS);
  res.cookie('rm_refresh', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TTL_MS
  });
}

function seedRoutes(userId) {
  const ins = db.prepare('INSERT INTO routes (user_id, title, time, km, tag, fav) VALUES (?, ?, ?, ?, ?, ?)');
  const seed = db.transaction((rows) => rows.forEach((r) => ins.run(userId, r.title, r.time, r.km, r.tag, r.fav)));
  seed(DEMO_ROUTES);
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email };
}

function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return fail(res, 401, 'Нет токена');
  try {
    const p = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(p.sub);
    if (!user) return fail(res, 401, 'Пользователь не найден');
    req.user = user;
    next();
  } catch {
    return fail(res, 401, 'Токен недействителен');
  }
}

// ---------- auth ----------
app.post('/api/register', (req, res) => {
  const { name = '', email = '', password = '' } = req.body || {};
  const n = String(name).trim().slice(0, 60);
  const e = String(email).trim().toLowerCase();
  const pw = String(password);
  if (!n) return fail(res, 400, 'Введите имя');
  if (!EMAIL_RE.test(e)) return fail(res, 400, 'Некорректный email');
  if (pw.length < 6) return fail(res, 400, 'Пароль — минимум 6 символов');
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(e)) {
    return fail(res, 409, 'Этот email уже зарегистрирован');
  }
  const passHash = bcrypt.hashSync(pw, 10);
  const { lastInsertRowid } = db.prepare('INSERT INTO users (name, email, pass_hash) VALUES (?, ?, ?)').run(n, e, passHash);
  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(lastInsertRowid);
  seedRoutes(user.id);
  issueRefresh(res, user.id);
  res.json({ ok: true, access: signAccess(user), user: publicUser(user) });
});

app.post('/api/login', (req, res) => {
  const { email = '', password = '' } = req.body || {};
  const e = String(email).trim().toLowerCase();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(e);
  if (!row || !bcrypt.compareSync(String(password), row.pass_hash)) {
    return fail(res, 401, 'Неверный email или пароль');
  }
  const user = { id: row.id, name: row.name, email: row.email };
  issueRefresh(res, user.id);
  res.json({ ok: true, access: signAccess(user), user: publicUser(user) });
});

app.post('/api/refresh', (req, res) => {
  const token = req.cookies.rm_refresh;
  if (!token) return fail(res, 401, 'Нет refresh-токена');
  try {
    const p = jwt.verify(token, JWT_SECRET);
    if (!p.jti) return fail(res, 401, 'Токен недействителен');
    const tokenHash = crypto.createHash('sha256').update(p.jti).digest('hex');
    const row = db.prepare('SELECT * FROM refresh_tokens WHERE token_hash = ?').get(tokenHash);
    if (!row || row.expires_at < Date.now()) return fail(res, 401, 'Сессия истекла, войдите заново');
    db.prepare('DELETE FROM refresh_tokens WHERE id = ?').run(row.id); // ротация
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(p.sub);
    if (!user) return fail(res, 401, 'Пользователь не найден');
    issueRefresh(res, user.id);
    res.json({ ok: true, access: signAccess(user), user: publicUser(user) });
  } catch {
    return fail(res, 401, 'Токен недействителен');
  }
});

app.post('/api/logout', (req, res) => {
  const token = req.cookies.rm_refresh;
  if (token) {
    try {
      const p = jwt.verify(token, JWT_SECRET);
      if (p.jti) {
        const h = crypto.createHash('sha256').update(p.jti).digest('hex');
        db.prepare('DELETE FROM refresh_tokens WHERE token_hash = ?').run(h);
      }
    } catch { /* уже невалиден — просто чистим куку */ }
  }
  res.clearCookie('rm_refresh', { path: '/' });
  res.json({ ok: true });
});

app.get('/api/me', auth, (req, res) => {
  res.json({ ok: true, user: publicUser(req.user) });
});

// ---------- routes (только свои) ----------
function rowToRoute(r) {
  return { id: r.id, title: r.title, time: r.time, km: r.km, tag: r.tag, fav: !!r.fav };
}

app.get('/api/routes', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM routes WHERE user_id = ? ORDER BY id').all(req.user.id);
  res.json(rows.map(rowToRoute));
});

app.post('/api/routes', auth, (req, res) => {
  const { title = '', time = '', km = 0, tag = '', fav = false } = req.body || {};
  if (!String(title).trim()) return fail(res, 400, 'Нужно название маршрута');
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO routes (user_id, title, time, km, tag, fav) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, String(title).trim().slice(0, 120), String(time).slice(0, 40), Number(km) || 0, String(tag).slice(0, 40), fav ? 1 : 0);
  const row = db.prepare('SELECT * FROM routes WHERE id = ?').get(lastInsertRowid);
  res.json(rowToRoute(row));
});

// ---------- build-route: пока демо-ломаная ----------
app.post('/api/build-route', (req, res) => {
  res.json({
    time: '2 ч 40 мин',
    distance: '6.8 км',
    difficulty: 'Средняя сложность',
    line: DEMO_LINE
  });
});

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'routemind' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`RouteMind API on http://localhost:${PORT}`));
