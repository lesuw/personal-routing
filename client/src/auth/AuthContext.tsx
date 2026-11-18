import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api/client';
import type { ApiUser } from '../types';

interface AuthContextValue {
  user: ApiUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  guest: () => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthContextValue | null>(null);

// Сессия: user | null, ready — закончилась ли проверка токена при старте.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      if (api.access) {
        try {
          setUser(await api.me());
        } catch { /* токен протух — остаёмся гостем */ }
      }
      setReady(true);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setUser(await api.login(email, password));
  };
  const register = async (name: string, email: string, password: string) => {
    setUser(await api.register(name, email, password));
  };
  const guest = async () => {
    setUser(await api.guest());
  };
  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, ready, login, register, guest, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth должен вызываться внутри AuthProvider');
  return ctx;
}
