import React from 'react';
import { IClock, IRoute, ILeaf } from './icons.jsx';

// Карточка построенного маршрута (демо-данные).
export default function RouteCard({ interestsLabel, onSave, onReset }) {
  return (
    <div className="route-card">
      <b>Ваш маршрут</b>
      <div className="route-row"><span className="ic"><IClock /></span><div><b>2 ч 40 мин</b><small>Время в пути</small></div></div>
      <div className="route-row"><span className="ic"><IRoute /></span><div><b>6.8 км</b><small>Расстояние</small></div></div>
      <div className="route-row"><span className="ic"><ILeaf /></span><div><b>Средняя сложность</b><div className="dots"><i className="on" /><i className="on" /><i className="on" /><i /><i /></div></div></div>
      <p className="hint">Учитываем: {interestsLabel}</p>
      <button className="btn-navy" onClick={onSave}>Сохранить маршрут</button>
      <button className="link-btn" onClick={onReset}>Сбросить</button>
    </div>
  );
}
