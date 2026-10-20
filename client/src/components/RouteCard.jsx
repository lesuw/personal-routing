import React from 'react';
import { IClock, IRoute, ILeaf } from './icons.jsx';

// Карточка построенного маршрута.
export default function RouteCard({ routeData, interestsLabel, onSave, onReset }) {
  const time = routeData?.time || '—';
  const distance = routeData?.distance || '—';
  const difficulty = routeData?.difficulty || '—';
  const level = routeData?.difficultyLevel || 3;

  return (
    <div className="route-card">
      <b>Ваш маршрут</b>
      <div className="route-row"><span className="ic"><IClock /></span><div><b>{time}</b><small>Время в пути</small></div></div>
      <div className="route-row"><span className="ic"><IRoute /></span><div><b>{distance}</b><small>Расстояние</small></div></div>
      <div className="route-row"><span className="ic"><ILeaf /></span><div><b>{difficulty}</b><div className="dots">{[1,2,3,4,5].map((i) => <i key={i} className={i <= level ? 'on' : ''} />)}</div></div></div>
      <p className="hint">Учитываем: {interestsLabel}</p>
      <button className="btn-navy" onClick={onSave}>Сохранить маршрут</button>
      <button className="link-btn" onClick={onReset}>Сбросить</button>
    </div>
  );
}
