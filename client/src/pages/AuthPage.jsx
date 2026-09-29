import React from 'react';
import AuthForm from '../auth/AuthForm.jsx';
import AuthPattern from '../auth/AuthPattern.jsx';

// Fullscreen: форма входа/регистрации + абстрактный узор.
export default function AuthPage() {
  return (
    <div className="auth-full">
      <AuthForm />
      <div className="auth-map">
        <AuthPattern />
      </div>
    </div>
  );
}
