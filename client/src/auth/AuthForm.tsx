import { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/Field';
import Logo from '../components/Logo';
import { useAuth } from './AuthContext';
import { IMail, ILock, IUser, IEye, IEyeOff } from '../components/icons';

interface FormState {
  name: string;
  email: string;
  password: string;
}

// Форма входа/регистрации: табы, поля, ошибки сервера, вход как гость.
export default function AuthForm() {
  const { login, register, guest } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await login(form.email.trim(), form.password);
      else await register(form.name.trim(), form.email.trim(), form.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка запроса');
    } finally {
      setBusy(false);
    }
  };

  const asGuest = async () => {
    setError('');
    setBusy(true);
    try {
      await guest();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка запроса');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-hero">
        <Logo />
        <h1>Поиск пешего маршрута по приоритетам пользователя</h1>
        <p className="sub">
          Выбирайте, что для вас важно — и находите идеальные маршруты
          для прогулок и путешествий.
        </p>
      </div>

      <div className="auth-card">
        <div className="tabs">
          {mode === 'login' ? (
            <>
              <button className="active" onClick={() => setMode('login')}>Вход</button>
              <button onClick={() => setMode('register')}>Регистрация</button>
            </>
          ) : (
            <>
              <button className="active" onClick={() => setMode('register')}>Регистрация</button>
              <button onClick={() => setMode('login')}>Вход</button>
            </>
          )}
        </div>

        <form onSubmit={submit}>
          {mode === 'register' && (
            <Field
              icon={<IUser />}
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              placeholder="Имя"
            />
          )}
          <Field
            icon={<IMail />}
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="Email"
            type="email"
          />
          <Field
            icon={<ILock />}
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            placeholder="Пароль"
            type={show ? 'text' : 'password'}
            right={
              <button type="button" className="eye" onClick={() => setShow(!show)} aria-label="Показать пароль">
                {show ? <IEyeOff /> : <IEye />}
              </button>
            }
          />
          {mode === 'login' && <span className="forgot-line">Забыли пароль?</span>}
          {error && <p className="form-error">{error}</p>}
          <button className="btn-lime" type="submit" disabled={busy}>
            {busy ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-links">
          {mode === 'login' ? (
            <span>Нет аккаунта? <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); }}>Зарегистрироваться</a></span>
          ) : (
            <span>Уже есть аккаунт? <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }}>Войти</a></span>
          )}
        </div>

        <div className="auth-foot">
          <button className="link-btn" onClick={asGuest} disabled={busy}>Продолжить как гость</button>
          <Link to="/discover" className="auth-link-muted">Посмотреть подборки маршрутов</Link>
        </div>
      </div>
    </div>
  );
}
