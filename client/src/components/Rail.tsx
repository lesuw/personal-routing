import type { ReactNode } from 'react';
import { ISearch, IRoute, IBookmark, IUser } from './icons';
import type { Tab } from '../types';

interface RailProps {
  tab: Tab;
  onTab: (tab: Tab) => void;
}

const TABS: Array<{ id: Tab; label: string; icon: ReactNode }> = [
  { id: 'search', label: 'Поиск', icon: <ISearch /> },
  { id: 'route', label: 'Маршрут', icon: <IRoute /> },
  { id: 'collections', label: 'Подборки', icon: <IBookmark /> },
  { id: 'profile', label: 'Профиль', icon: <IUser /> }
];

// Боковой rail: search | route | collections | profile.
export default function Rail({ tab, onTab }: RailProps) {
  return (
    <div className="app-rail">
      {TABS.map((item) => (
        <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => onTab(item.id)}>
          <span className="i">{item.icon}</span>
          {item.label}
        </button>
      ))}

      <div className="rail-grow" />

      <div className="rail-trees" aria-hidden="true">
        <svg viewBox="0 0 80 54" fill="none">
          <path d="M40 4l13 19H42l11 15H27l11-15H23L40 4z" fill="#2f4b37" />
          <path d="M40 16l9 14H43l8 11H29l8-11H31l9-14z" fill="#3c5f43" opacity="0.85" />
          <path d="M40 40v10" stroke="#4a4030" strokeWidth="3" strokeLinecap="round" />
          <path d="M14 22l8 12h-5l7 10H4l7-10h-5l8-12z" fill="#2a4432" />
          <path d="M66 26l7 11h-4l6 9H58l6-9h-4l6-11z" fill="#2a4432" />
        </svg>
        <span>Больше природы<br />в каждом шаге</span>
      </div>
    </div>
  );
}
