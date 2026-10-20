const crypto = require('crypto');
const db = require('../db.js');
const {
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
} = require('../utils/auth.js');

function registerHandler(req, res) {
  const { name = '', email = '', password = '' } = req.body || {};
  const userName = String(name).trim().slice(0, 60);
  const userEmail = String(email).trim().toLowerCase();
  const userPassword = String(password);

  if (!userName) return fail(res, 400, 'Введите имя');
  if (!EMAIL_RE.test(userEmail)) return fail(res, 400, 'Некорректный email');
  if (userPassword.length < 6) return fail(res, 400, 'Пароль — минимум 6 символов');

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(userEmail);
  if (existingUser) return fail(res, 409, 'Этот email уже зарегистрирован');

  const passwordHash = bcrypt.hashSync(userPassword, 10);
  const result = db.prepare('INSERT INTO users (name, email, pass_hash) VALUES (?, ?, ?)')
    .run(userName, userEmail, passwordHash);

  const newUser = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(result.lastInsertRowid);
  seedDemoRoutes(newUser.id, db);
  issueRefreshToken(res, newUser.id, db);
  res.json({ ok: true, access: signAccessToken(newUser), user: publicUser(newUser) });
}

function loginHandler(req, res) {
  const { email = '', password = '' } = req.body || {};
  const userEmail = String(email).trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(userEmail);

  if (!user || !bcrypt.compareSync(String(password), user.pass_hash)) {
    return fail(res, 401, 'Неверный email или пароль');
  }

  const publicUserData = { id: user.id, name: user.name, email: user.email };
  issueRefreshToken(res, user.id, db);
  res.json({ ok: true, access: signAccessToken(publicUserData), user: publicUserData });
}

function refreshHandler(req, res) {
  const token = req.cookies.rm_refresh;
  if (!token) return fail(res, 401, 'Нет refresh-токена');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload.jti) return fail(res, 401, 'Токен недействителен');

    const tokenHash = crypto.createHash('sha256').update(payload.jti).digest('hex');
    const storedToken = db.prepare('SELECT * FROM refresh_tokens WHERE token_hash = ?').get(tokenHash);
    if (!storedToken || storedToken.expires_at < Date.now()) {
      return fail(res, 401, 'Сессия истекла, войдите заново');
    }

    db.prepare('DELETE FROM refresh_tokens WHERE id = ?').run(storedToken.id);

    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(payload.sub);
    if (!user) return fail(res, 401, 'Пользователь не найден');

    issueRefreshToken(res, user.id, db);
    res.json({ ok: true, access: signAccessToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('[refresh] error:', err);
    return fail(res, 401, 'Токен недействителен');
  }
}

function logoutHandler(req, res) {
  const token = req.cookies.rm_refresh;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      if (payload.jti) {
        const tokenHash = crypto.createHash('sha256').update(payload.jti).digest('hex');
        db.prepare('DELETE FROM refresh_tokens WHERE token_hash = ?').run(tokenHash);
      }
    } catch {
      // токен уже невалиден — просто чистим куку
    }
  }
  res.clearCookie('rm_refresh', { path: '/' });
  res.json({ ok: true });
}

function meHandler(req, res) {
  res.json({ ok: true, user: publicUser(req.user) });
}

module.exports = {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  meHandler
};