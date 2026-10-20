import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import MapPage from './pages/MapPage.jsx';
import DiscoverPage from './pages/DiscoverPage.jsx';

// Закрытые экраны: без сессии — назад на вход.
function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="page"><p className="hint">Загрузка…</p></div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/map" element={<RequireAuth><MapPage /></RequireAuth>} />
          <Route path="/discover" element={<RequireAuth><DiscoverPage /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
