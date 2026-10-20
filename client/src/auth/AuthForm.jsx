import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/Field.jsx';
import Logo from '../components/Logo.jsx';
import { useAuth } from './AuthContext.jsx';
import { IMail, ILock, IUser, IEye, IEyeOff } from '../components/icons.jsx';

// Форма входа/регистрации: табы, поля, ошибки сервера, вход как гость.
export default function AuthForm() {
  const { login, register, guest } = useAuth();
  const [mode, setMode] = useState('login'); // login | register
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await login(form.email.trim(), form.password);
      else await register(form.name.trim(), form.email.trim(), form.password);
    } catch (err) {
      setError(err.message);
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
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-form">
      <Logo />
      <h1>Ваш маршрут<br />по интересам</h1>
      <p className="sub">Пешие маршруты по Красноярску с учетом предпочтений: тень, тишина и ритм города.</p>

      <div className="tabs">
        <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Вход</button>
        <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Регистрация</button>
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
          placeholder="Электронная почта"
          type="email"
        />
        <Field
          icon={<ILock />}
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
          placeholder={mode === 'login' ? 'Пароль' : 'Пароль (минимум 6 символов)'}
          type={show ? 'text' : 'password'}
          right={
            <button type="button" className="eye" onClick={() => setShow(!show)} aria-label="Показать пароль">
              {show ? <IEyeOff /> : <IEye />}
            </button>
          }
        />
        {error && <p className="form-error">{error}</p>}
        <button className="btn-lime" type="submit" disabled={busy}>
          {busy ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
        </button>
      </form>

      <div className="auth-links">
        {mode === 'login' ? (
          <span>Нет аккаунта? <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); }}>Зарегистрироваться</a></span>
        ) : (
          <span>Есть аккаунт? <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }}>Войти</a></span>
        )}
        <button className="link-btn" onClick={asGuest} disabled={busy}>Продолжить как гость</button>
        <Link to="/discover" className="auth-link-muted">Посмотреть подборки маршрутов</Link>
      </div>
    </div>
  );
}
