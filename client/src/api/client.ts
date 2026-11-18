import type { ApiUser, Coords, RouteData, SavedRoute } from '../types';

// Тонкий клиент к /api: access-токен в заголовке, refresh по httpOnly-куке.
const KEY = 'routemind_access';

let access: string | null = null;
try {
  access = localStorage.getItem(KEY);
} catch { /* приватный режим */ }

function setAccess(token: string | null): void {
  access = token || null;
  try {
    if (token) localStorage.setItem(KEY, token);
    else localStorage.removeItem(KEY);
  } catch { /* ignore */ }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  retry?: boolean;
}

interface AuthResponse {
  access: string;
  user: ApiUser;
}

async function req<T>(path: string, { method = 'GET', body, retry = true }: RequestOptions = {}): Promise<T> {
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
    const refreshRes = await fetch('/api/refresh', { method: 'POST', credentials: 'include' });
    if (refreshRes.ok) {
      const data = (await refreshRes.json()) as AuthResponse;
      setAccess(data.access);
      return req<T>(path, { method, body, retry: false });
    }
    setAccess(null);
  }
  let data: { error?: string } | null = null;
  try {
    data = (await res.json()) as { error?: string };
  } catch { /* пустой ответ */ }
  if (!res.ok) throw new Error(data?.error || 'Ошибка запроса');
  return data as T;
}

export const api = {
  get access(): string | null {
    return access;
  },
  async register(name: string, email: string, password: string): Promise<ApiUser> {
    const data = await req<AuthResponse>('/api/register', {
      method: 'POST',
      body: { name, email, password },
      retry: false
    });
    setAccess(data.access);
    return data.user;
  },
  async login(email: string, password: string): Promise<ApiUser> {
    const data = await req<AuthResponse>('/api/login', {
      method: 'POST',
      body: { email, password },
      retry: false
    });
    setAccess(data.access);
    return data.user;
  },
  // Гость — отдельный одноразовый аккаунт, его маршруты изолированы
  async guest(): Promise<ApiUser> {
    const suffix = Date.now().toString(36);
    const password = (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : String(Math.random())) + suffix;
    return this.register('Гость', `guest-${suffix}@routemind.local`, password);
  },
  async logout(): Promise<void> {
    try {
      await req('/api/logout', { method: 'POST', retry: false });
    } finally {
      setAccess(null);
    }
  },
  async me(): Promise<ApiUser> {
    const data = await req<{ user: ApiUser }>('/api/me');
    return data.user;
  },
  getRoutes(): Promise<SavedRoute[]> {
    return req<SavedRoute[]>('/api/routes');
  },
  createRoute(route: Partial<SavedRoute>): Promise<SavedRoute> {
    return req<SavedRoute>('/api/routes', { method: 'POST', body: route });
  },
  buildRoute(from: Coords, to: Coords, profile = 'foot-walking'): Promise<RouteData> {
    return req<RouteData>('/api/build-route', { method: 'POST', body: { from, to, profile } });
  }
};
