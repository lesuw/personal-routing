import React from 'react';
import ChipRow from '../components/ChipRow.jsx';
import { IStar } from '../components/icons.jsx';
import { PLACE_CATS } from './SearchPanel.jsx';

// Вкладка «Подборки»: готовые прогулочные маршруты. Клик уводит в конструктор.
export default function CollectionsPanel({
  collCat, onCollCat, collections, favs, onToggleFav, onSelect, onOpenAll
}) {
  return (
    <>
      <h3>Подборки</h3>
      <p className="hint">Готовые прогулочные маршруты: достопримечательности, кафе и природа.</p>
      <ChipRow items={PLACE_CATS} active={[collCat]} onToggle={onCollCat} />
      {collections.map((c) => (
        <button key={c.id} className="coll-item" onClick={() => onSelect(c.title)}>
          <img src={c.img} alt={c.title} />
          <span className="body">
            <span className="badge">{c.cat}</span>
            <b>{c.title}</b>
            <small>{c.time} · {c.km}</small>
          </span>
          <span
            className="place-go coll-fav"
            onClick={(e) => { e.stopPropagation(); onToggleFav(c.id); }}
          >
            <IStar filled={favs.includes(c.id)} />
          </span>
        </button>
      ))}
      <button className="btn-navy" onClick={onOpenAll}>Открыть все подборки</button>
    </>
  );
}
