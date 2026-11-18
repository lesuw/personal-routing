import ChipRow from '../components/ChipRow';
import { ISearch, IPin, ITree, ILocate, IArrow } from '../components/icons';
import type { Place } from '../types';

export const PLACE_CATS = ['Все', 'Достопримечательности', 'Кафе', 'Природа'];

function placeIcon(cat: string) {
  if (cat === 'Кафе') return <IPin />;
  if (cat === 'Природа') return <ITree />;
  return <ILocate />;
}

interface SearchPanelProps {
  query: string;
  onQuery: (value: string) => void;
  placeCat: string;
  onPlaceCat: (cat: string) => void;
  places: Place[];
  onSelect: (place: Place) => void;
}

// Вкладка «Поиск»: куда пойти. Выбор места уводит в конструктор маршрута.
export default function SearchPanel({ query, onQuery, placeCat, onPlaceCat, places, onSelect }: SearchPanelProps) {
  return (
    <>
      <h3>Куда пойдём?</h3>
      <div className="route-input">
        <span className="ic"><ISearch /></span>
        <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Место, улица, кафе…" />
      </div>
      <ChipRow items={PLACE_CATS} active={[placeCat]} onToggle={onPlaceCat} />
      {places.length === 0 && <p className="hint">Ничего не найдено. Попробуйте другой запрос.</p>}
      {places.map((place) => (
        <button key={place.id} className="place-row" onClick={() => onSelect(place)}>
          <span className="ic navy">{placeIcon(place.cat)}</span>
          <span className="place-text">
            <b>{place.title}</b>
            <small>{place.address} · {place.cat}</small>
          </span>
          <span className="place-go"><IArrow /></span>
        </button>
      ))}
    </>
  );
}
