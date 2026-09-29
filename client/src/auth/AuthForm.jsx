import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Field from '../components/Field.jsx';
import Logo from '../components/Logo.jsx';
import { IMail, ILock, IUser, IEye, IEyeOff } from '../components/icons.jsx';

// Форма входа/регистрации: табы, поля, ссылки. Без логики — submit ведёт на /map.
export default function AuthForm() {
  const nav = useNavigate();
  const [mode, setMode] = useState('login'); // login | register
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = (e) => {
    e.preventDefault();
    nav('/map');
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
          placeholder="Пароль"
          type={show ? 'text' : 'password'}
          right={
            <button type="button" className="eye" onClick={() => setShow(!show)} aria-label="Показать пароль">
              {show ? <IEyeOff /> : <IEye />}
            </button>
          }
        />
        <button className="btn-lime" type="submit">{mode === 'login' ? 'Войти' : 'Создать аккаунт'}</button>
      </form>

      <div className="auth-links">
        {mode === 'login' ? (
          <span>Нет аккаунта? <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); }}>Зарегистрироваться</a></span>
        ) : (
          <span>Есть аккаунт? <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }}>Войти</a></span>
        )}
        <button className="link-btn" onClick={() => nav('/map')}>Продолжить как гость</button>
        <Link to="/discover" className="auth-link-muted">Посмотреть подборки маршрутов</Link>
      </div>
    </div>
  );
}
