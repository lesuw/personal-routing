import React from 'react';
import { IClock, IPin, IArrow } from '../components/icons.jsx';

// Карточка подборки маршрута.
export default function DiscoverCard({ card, tag, onOpen }) {
  return (
    <div className="d-card">
      <img src={card.img} alt={card.title} />
      <div className="body">
        <span className="badge">{tag}</span>
        <b>{card.title}</b>
        <div className="d-meta">
          <span className="d-meta-row">
            <span className="d-meta-item"><IClock />{card.time}</span>
            <span className="d-meta-item"><IPin />{card.km}</span>
          </span>
          <button className="go" onClick={onOpen} aria-label="Открыть"><IArrow /></button>
        </div>
      </div>
    </div>
  );
}
