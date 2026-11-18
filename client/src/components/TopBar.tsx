import { useState } from 'react';
import Logo from './Logo';
import { ISearch, IBell, IChevronDown } from './icons';

interface TopBarProps {
  query: string;
  onQuery: (value: string) => void;
  onFocusSearch: () => void;
  onGoProfile: () => void;
  onNavigate: (path: string) => void;
  initial?: string;
  name?: string;
  onLogout: () => void;
}

// Верхняя панель docked-приложения: лого, глобальный поиск, уведомления, профиль.
export default function TopBar({
  query, onQuery, onFocusSearch, onGoProfile, onNavigate,
  initial = 'А', name = 'Гость', onLogout
}: TopBarProps) {
  const [menu, setMenu] = useState(false);
  const go = (fn: () => void) => () => { setMenu(false); fn(); };

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
        <button className="icon-btn" onClick={onGoProfile} aria-label="Уведомления">
          <IBell />
        </button>
        <button className="user-chip" onClick={() => setMenu(!menu)} aria-label="Меню профиля">
          <span className="avatar-dot">{initial}</span>
          <span className="top-user-name">{name}</span>
          <span className="chev"><IChevronDown /></span>
        </button>
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
