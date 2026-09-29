import React from 'react';
import ChipRow from '../components/ChipRow.jsx';
import { ISearch, IPin, ITree, ILocate, IArrow } from '../components/icons.jsx';

export const PLACE_CATS = ['Все', 'Достопримечательности', 'Кафе', 'Природа'];

function placeIcon(cat) {
  if (cat === 'Кафе') return <IPin />;
  if (cat === 'Природа') return <ITree />;
  return <ILocate />;
}

// Вкладка «Поиск»: куда пойти. Выбор места уводит в конструктор маршрута.
export default function SearchPanel({ query, onQuery, placeCat, onPlaceCat, places, onSelect }) {
  return (
    <>
      <h3>Куда пойдём?</h3>
      <div className="route-input">
        <span className="ic"><ISearch /></span>
        <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Место, улица, кафе…" />
      </div>
      <ChipRow items={PLACE_CATS} active={[placeCat]} onToggle={onPlaceCat} />
      {places.length === 0 && <p className="hint">Ничего не найдено. Попробуйте другой запрос.</p>}
      {places.map((p) => (
        <button key={p.id} className="place-row" onClick={() => onSelect(p.title)}>
          <span className="ic navy">{placeIcon(p.cat)}</span>
          <span className="place-text">
            <b>{p.title}</b>
            <small>{p.address} · {p.cat}</small>
          </span>
          <span className="place-go"><IArrow /></span>
        </button>
      ))}
    </>
  );
}
