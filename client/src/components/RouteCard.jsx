import React from 'react';
import { IClock, IRoute, ILeaf, IStar, ITree, IVolumeOff, IUsers, IZap } from './icons.jsx';

// Карточка построенного маршрута.
export default function RouteCard({ routeData, interestsLabel, onSave, onReset }) {
  const time = routeData?.time || '—';
  const distance = routeData?.distance || '—';
  const difficulty = routeData?.difficulty || '—';
  const level = routeData?.difficultyLevel || 3;
  const labels = (interestsLabel || '').split(' · ').filter(Boolean);
  const chipIcon = (i) => [<ITree />, <IVolumeOff />, <ITree />, <IUsers />, <IZap />][i % 5];

  return (
    <div className="route-card">
      <div className="route-hero">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=900&auto=format&fit=crop"
          alt="Лесной маршрут"
        />
      </div>
      <div className="route-body">
        <b className="route-title">Лесной маршрут</b>
        <p className="route-desc">
          Тихая тропа через парк: много тени, птицы и свежий воздух.
        </p>

        <div className="route-stats">
          <span><IRoute /> {distance}</span>
          <span><IClock /> {time}</span>
          <span><ILeaf /> {difficulty}</span>
        </div>

        <div className="section-label">Приоритеты</div>
        <div className="route-chips">
          {labels.map((label, i) => (
            <span key={label}>{chipIcon(i)}{label}</span>
          ))}
        </div>

        <div className="route-difficulty">
          <span>Сложность</span>
          <span className="dots">{[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= level ? 'on' : ''} />)}</span>
        </div>

        <button className="btn-navy" onClick={onSave}>
          <span className="ic ic-text"><IStar filled /></span>
          Сохранить в избранное
        </button>
        <button className="link-btn" onClick={onReset}>Сбросить маршрут</button>

        <div className="elevation">
          <svg viewBox="0 0 320 70" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M0 62 L14 52 L30 56 L46 42 L62 48 L78 34 L94 40 L110 24 L126 32 L142 18 L158 26 L174 12 L190 22 L206 16 L222 30 L238 22 L254 38 L270 30 L286 44 L302 36 L320 50"
              fill="none"
              stroke="#a9c47f"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M0 70 L0 62 L14 52 L30 56 L46 42 L62 48 L78 34 L94 40 L110 24 L126 32 L142 18 L158 26 L174 12 L190 22 L206 16 L222 30 L238 22 L254 38 L270 30 L286 44 L302 36 L320 50 L320 70 Z"
              fill="#a9c47f"
              opacity="0.12"
            />
          </svg>
          <div className="elevation-labels">
            <span>↑ 120 м</span>
            <span>↓ 130 м</span>
          </div>
        </div>
      </div>
    </div>
  );
}
