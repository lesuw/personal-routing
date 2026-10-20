import React, { useState } from 'react';
import Logo from './Logo.jsx';
import { ISearch, IMenu } from './icons.jsx';

// Верхняя панель docked-приложения: лого, глобальный поиск, аватар, бургер-меню.
export default function TopBar({ query, onQuery, onFocusSearch, onGoProfile, onNavigate, initial = 'А', onLogout }) {
  const [menu, setMenu] = useState(false);
  const go = (fn) => () => { setMenu(false); fn(); };

  return (
    <div className="app-topbar">
      <Logo />
      <div className="search">
        <div className="search-box">
          <span className="ic"><ISearch /></span>
          <input
            placeholder="Куда хотите отправиться?"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            onFocus={onFocusSearch}
          />
        </div>
      </div>
      <div className="top-actions">
        <div className="avatar-dot" onClick={onGoProfile}>{initial}</div>
        <button className="burger" onClick={() => setMenu(!menu)} aria-label="Меню"><IMenu /></button>
        {menu && (
          <div className="dropdown">
            <button onClick={go(() => onNavigate('/discover'))}>Подборки маршрутов</button>
            <button onClick={go(onGoProfile)}>Профиль</button>
            <button onClick={go(onLogout)}>Выйти</button>
          </div>
        )}
      </div>
    </div>
  );
}
