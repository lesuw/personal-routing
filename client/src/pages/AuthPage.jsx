import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthForm from '../auth/AuthForm.jsx';
import AuthPattern from '../auth/AuthPattern.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

// Fullscreen: форма входа/регистрации + абстрактный узор.
// Залогиненных сразу отправляем на карту.
export default function AuthPage() {
  const { user, ready } = useAuth();
  if (ready && user) return <Navigate to="/map" replace />;
  return (
    <div className="auth-full">
      <AuthForm />
      <div className="auth-map">
        <AuthPattern />
      </div>
    </div>
  );
}
