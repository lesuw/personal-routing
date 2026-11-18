import { Navigate } from 'react-router-dom';
import AuthForm from '../auth/AuthForm';
import AuthPattern from '../auth/AuthPattern';
import { useAuth } from '../auth/AuthContext';

// Fullscreen: лесной пейзаж на фоне + тёмная карточка формы.
// Залогиненных сразу отправляем на карту.
export default function AuthPage() {
  const { user, ready } = useAuth();
  if (ready && user) return <Navigate to="/map" replace />;
  return (
    <div className="auth-full">
      <AuthPattern />
      <AuthForm />
    </div>
  );
}
