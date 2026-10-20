import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client.js';

const Ctx = createContext(null);

// Сессия: user | null, ready — закончилась ли проверка токена при старте.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
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

  const login = async (email, password) => setUser(await api.login(email, password));
  const register = async (name, email, password) => setUser(await api.register(name, email, password));
  const guest = async () => setUser(await api.guest());
  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return <Ctx.Provider value={{ user, ready, login, register, guest, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
