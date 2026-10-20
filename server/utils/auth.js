const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ACCESS_TTL = '15m';
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(res, code, error) {
  return res.status(code).json({ ok: false, error });
}

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: ACCESS_TTL }
  );
}

function issueRefreshToken(res, userId, db) {
  const tokenId = crypto.randomUUID();
  const token = jwt.sign({ sub: userId, jti: tokenId }, JWT_SECRET, { expiresIn: '30d' });
  const tokenHash = crypto.createHash('sha256').update(tokenId).digest('hex');
  db.prepare(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)'
  ).run(userId, tokenHash, Date.now() + REFRESH_TTL_MS);
  res.cookie('rm_refresh', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TTL_MS
  });
}

function seedDemoRoutes(userId, db) {
  const DEMO_ROUTES = [
    { title: 'Смотровые площадки Красноярска', time: '3 ч 20 мин', km: 8.5, tag: 'Природа', fav: 1 },
    { title: 'Бобровый лог и лесные тропы', time: '2 ч 10 мин', km: 5.7, tag: 'Природа', fav: 1 },
    { title: 'Город и набережная', time: '2 ч 50 мин', km: 7.4, tag: 'Комбинированный', fav: 0 }
  ];
  const insertStmt = db.prepare(
    'INSERT INTO routes (user_id, title, time, km, tag, fav) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const transaction = db.transaction((rows) => {
    rows.forEach((route) => insertStmt.run(userId, route.title, route.time, route.km, route.tag, route.fav));
  });
  transaction(DEMO_ROUTES);
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function authMiddleware(db) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return fail(res, 401, 'Нет токена');
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(payload.sub);
      if (!user) return fail(res, 401, 'Пользователь не найден');
      req.user = user;
      next();
    } catch {
      return fail(res, 401, 'Токен недействителен');
    }
  };
}

module.exports = {
  fail,
  signAccessToken,
  issueRefreshToken,
  seedDemoRoutes,
  publicUser,
  authMiddleware,
  EMAIL_RE,
  bcrypt,
  jwt,
  JWT_SECRET
};