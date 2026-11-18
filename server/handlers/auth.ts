import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import db from '../db';
import {
  fail,
  signAccessToken,
  issueRefreshToken,
  seedDemoRoutes,
  publicUser,
  EMAIL_RE,
  bcrypt,
  jwt,
  JWT_SECRET
} from '../utils/auth';
import type { AuthTokenPayload, PublicUser, RefreshTokenRow, UserRow } from '../types';

interface AuthBody {
  name?: unknown;
  email?: unknown;
  password?: unknown;
}

function registerHandler(req: Request, res: Response): Response {
  const { name = '', email = '', password = '' } = (req.body ?? {}) as AuthBody;
  const userName = String(name).trim().slice(0, 60);
  const userEmail = String(email).trim().toLowerCase();
  const userPassword = String(password);

  if (!userName) return fail(res, 400, 'Введите имя');
  if (!EMAIL_RE.test(userEmail)) return fail(res, 400, 'Некорректный email');
  if (userPassword.length < 6) return fail(res, 400, 'Пароль — минимум 6 символов');

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?')
    .get(userEmail) as { id: number } | undefined;
  if (existingUser) return fail(res, 409, 'Этот email уже зарегистрирован');

  const passwordHash = bcrypt.hashSync(userPassword, 10);
  const result = db.prepare('INSERT INTO users (name, email, pass_hash) VALUES (?, ?, ?)')
    .run(userName, userEmail, passwordHash);

  const newUser = db.prepare('SELECT id, name, email FROM users WHERE id = ?')
    .get(result.lastInsertRowid) as PublicUser;
  seedDemoRoutes(newUser.id, db);
  issueRefreshToken(res, newUser.id, db);
  return res.json({ ok: true, access: signAccessToken(newUser), user: publicUser(newUser) });
}

function loginHandler(req: Request, res: Response): Response {
  const { email = '', password = '' } = (req.body ?? {}) as AuthBody;
  const userEmail = String(email).trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(userEmail) as UserRow | undefined;

  if (!user || !bcrypt.compareSync(String(password), user.pass_hash)) {
    return fail(res, 401, 'Неверный email или пароль');
  }

  const publicUserData: PublicUser = { id: user.id, name: user.name, email: user.email };
  issueRefreshToken(res, user.id, db);
  return res.json({ ok: true, access: signAccessToken(publicUserData), user: publicUserData });
}

function refreshHandler(req: Request, res: Response): Response {
  const token = req.cookies.rm_refresh as string | undefined;
  if (!token) return fail(res, 401, 'Нет refresh-токена');

  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as AuthTokenPayload;
    if (!payload.jti) return fail(res, 401, 'Токен недействителен');

    const tokenHash = crypto.createHash('sha256').update(payload.jti).digest('hex');
    const storedToken = db.prepare('SELECT * FROM refresh_tokens WHERE token_hash = ?')
      .get(tokenHash) as RefreshTokenRow | undefined;
    if (!storedToken || storedToken.expires_at < Date.now()) {
      return fail(res, 401, 'Сессия истекла, войдите заново');
    }

    db.prepare('DELETE FROM refresh_tokens WHERE id = ?').run(storedToken.id);

    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?')
      .get(payload.sub) as PublicUser | undefined;
    if (!user) return fail(res, 401, 'Пользователь не найден');

    issueRefreshToken(res, user.id, db);
    return res.json({ ok: true, access: signAccessToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('[refresh] error:', err);
    return fail(res, 401, 'Токен недействителен');
  }
}

function logoutHandler(req: Request, res: Response): Response {
  const token = req.cookies.rm_refresh as string | undefined;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as unknown as AuthTokenPayload;
      if (payload.jti) {
        const tokenHash = crypto.createHash('sha256').update(payload.jti).digest('hex');
        db.prepare('DELETE FROM refresh_tokens WHERE token_hash = ?').run(tokenHash);
      }
    } catch {
      // токен уже невалиден — просто чистим куку
    }
  }
  res.clearCookie('rm_refresh', { path: '/' });
  return res.json({ ok: true });
}

function meHandler(req: Request, res: Response): Response {
  return res.json({ ok: true, user: publicUser(req.user as PublicUser) });
}

export {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  meHandler
};
