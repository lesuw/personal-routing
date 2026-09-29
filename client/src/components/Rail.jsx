import React from 'react';
import { ISearch, IRoute, IBookmark, IUser } from './icons.jsx';

const TABS = [
  { id: 'search', label: 'Поиск', icon: <ISearch /> },
  { id: 'route', label: 'Маршрут', icon: <IRoute /> },
  { id: 'collections', label: 'Подборки', icon: <IBookmark /> },
  { id: 'profile', label: 'Профиль', icon: <IUser /> }
];

// Боковой rail: search | route | collections | profile.
export default function Rail({ tab, onTab }) {
  return (
    <div className="app-rail">
      {TABS.map((t) => (
        <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => onTab(t.id)}>
          <span className="i">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
