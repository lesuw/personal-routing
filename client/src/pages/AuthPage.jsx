import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ILogo, IMail, ILock, IUser, IEye, IEyeOff } from '../components/icons.jsx';

function AuthPattern() {
  return (
    <svg className="pattern" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
      <rect width="600" height="800" fill="#fdfbf3" />
      {/* мягкие пятна палитры */}
      <circle cx="90" cy="130" r="150" fill="#92bad5" opacity="0.22" />
      <circle cx="520" cy="120" r="90" fill="#788ce3" opacity="0.18" />
      <ellipse cx="480" cy="660" rx="230" ry="210" fill="#dff478" opacity="0.85" />
      <ellipse cx="120" cy="620" rx="150" ry="130" fill="#92bad5" opacity="0.18" />
      {/* волна */}
      <path d="M-40 300 C 140 260, 220 340, 400 300 S 560 250, 660 300 L660 0 L-40 0 Z" fill="#788ce3" opacity="0.12" />
      <path d="M-40 340 C 140 300, 220 380, 400 340 S 560 290, 660 340" fill="none" stroke="#788ce3" strokeWidth="2" opacity="0.35" />
      {/* тонкая сетка-точки */}
      <g fill="#17243f" opacity="0.14">
        <circle cx="80" cy="420" r="3" />
        <circle cx="120" cy="420" r="3" />
        <circle cx="160" cy="420" r="3" />
        <circle cx="200" cy="420" r="3" />
        <circle cx="80" cy="460" r="3" />
        <circle cx="120" cy="460" r="3" />
        <circle cx="160" cy="460" r="3" />
        <circle cx="200" cy="460" r="3" />
        <circle cx="80" cy="500" r="3" />
        <circle cx="120" cy="500" r="3" />
        <circle cx="160" cy="500" r="3" />
        <circle cx="200" cy="500" r="3" />
      </g>
      {/* абстрактный маршрут */}
      <path
        d="M60 700 C 160 660, 140 540, 260 520 S 420 460, 430 350 S 500 220, 420 160"
        fill="none"
        stroke="#17243f"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 12"
      />
      <g>
        <circle cx="60" cy="700" r="14" fill="#17243f" />
        <circle cx="60" cy="700" r="5.5" fill="#fdfbf3" />
        <circle cx="260" cy="520" r="11" fill="#fdfbf3" stroke="#17243f" strokeWidth="3" />
        <circle cx="430" cy="350" r="11" fill="#92bad5" stroke="#17243f" strokeWidth="3" />
        <circle cx="420" cy="160" r="14" fill="#dff478" stroke="#17243f" strokeWidth="3" />
      </g>
      {/* дуги */}
      <path d="M380 700 A 120 120 0 01500 580" fill="none" stroke="#17243f" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="500" cy="580" r="7" fill="#17243f" />
      <path d="M120 220 A 90 90 0 01210 160" fill="none" stroke="#92bad5" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export default function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState('login');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = (e) => {
    e.preventDefault();
    nav('/map');
  };

  return (
    <div className="auth-full">
      <div className="auth-form">
        <div className="logo">
          <ILogo />
          RouteMind
        </div>
        <h1>Ваш маршрут<br />по интересам</h1>
        <p className="sub">Пешие маршруты по Красноярску с учетом предпочтений: тень, тишина и ритм города.</p>

        <div className="tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Вход</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Регистрация</button>
        </div>

        <form onSubmit={submit}>
          {mode === 'register' && (
            <div className="field">
              <span className="ico"><IUser /></span>
              <input placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          )}
          <div className="field">
            <span className="ico"><IMail /></span>
            <input placeholder="Электронная почта" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <span className="ico"><ILock /></span>
            <input placeholder="Пароль" type={show ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" className="eye" onClick={() => setShow(!show)} aria-label="Показать пароль">
              {show ? <IEyeOff /> : <IEye />}
            </button>
          </div>
          <button className="btn-lime" type="submit">{mode === 'login' ? 'Войти' : 'Создать аккаунт'}</button>
        </form>

        <div className="auth-links">
          {mode === 'login' ? (
            <span>Нет аккаунта? <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); }}>Зарегистрироваться</a></span>
          ) : (
            <span>Есть аккаунт? <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }}>Войти</a></span>
          )}
          <button className="link-btn" onClick={() => nav('/map')}>Продолжить как гость</button>
          <Link to="/discover" style={{ fontSize: 13, color: '#8a97a8' }}>Посмотреть подборки маршрутов</Link>
        </div>
      </div>

      <div className="auth-map">
        <AuthPattern />
      </div>
    </div>
  );
}
