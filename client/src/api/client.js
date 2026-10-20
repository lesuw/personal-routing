// Тонкий клиент к /api: access-токен в заголовке, refresh по httpOnly-куке.
const KEY = 'routemind_access';

let access = null;
try {
  access = localStorage.getItem(KEY);
} catch { /* приватный режим */ }

function setAccess(t) {
  access = t || null;
  try {
    if (t) localStorage.setItem(KEY, t);
    else localStorage.removeItem(KEY);
  } catch { /* ignore */ }
}

async function req(path, { method = 'GET', body, retry = true } = {}) {
  const res = await fetch(path, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(access ? { Authorization: `Bearer ${access}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (res.status === 401 && retry && access) {
    // access протух — пробуем обновить по refresh-куке и повторяем запрос
    const r = await fetch('/api/refresh', { method: 'POST', credentials: 'include' });
    if (r.ok) {
      const d = await r.json();
      setAccess(d.access);
      return req(path, { method, body, retry: false });
    }
    setAccess(null);
  }
  let data = null;
  try {
    data = await res.json();
  } catch { /* пустой ответ */ }
  if (!res.ok) throw new Error((data && data.error) || 'Ошибка запроса');
  return data;
}

export const api = {
  get access() {
    return access;
  },
  async register(name, email, password) {
    const d = await req('/api/register', { method: 'POST', body: { name, email, password }, retry: false });
    setAccess(d.access);
    return d.user;
  },
  async login(email, password) {
    const d = await req('/api/login', { method: 'POST', body: { email, password }, retry: false });
    setAccess(d.access);
    return d.user;
  },
  // Гость — отдельный одноразовый аккаунт, его маршруты изолированы
  async guest() {
    const n = Date.now().toString(36);
    const pw = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random())) + n;
    return this.register('Гость', `guest-${n}@routemind.local`, pw);
  },
  async logout() {
    try {
      await req('/api/logout', { method: 'POST', retry: false });
    } finally {
      setAccess(null);
    }
  },
  async me() {
    const d = await req('/api/me');
    return d.user;
  },
  getRoutes() {
    return req('/api/routes');
  },
  createRoute(route) {
    return req('/api/routes', { method: 'POST', body: route });
  },
  buildRoute(from, to, profile = 'foot-walking') {
    return req('/api/build-route', { method: 'POST', body: { from, to, profile } });
  }
};
