import ChipRow from '../components/ChipRow';
import { IStar } from '../components/icons';
import { PLACE_CATS } from './SearchPanel';
import type { Collection } from '../types';

interface CollectionsPanelProps {
  collCat: string;
  onCollCat: (cat: string) => void;
  collections: Collection[];
  favs: number[];
  onToggleFav: (id: number) => void;
  onSelect: (title: string) => void;
  onOpenAll: () => void;
}

// Вкладка «Подборки»: готовые прогулочные маршруты. Клик уводит в конструктор.
export default function CollectionsPanel({
  collCat, onCollCat, collections, favs, onToggleFav, onSelect, onOpenAll
}: CollectionsPanelProps) {
  return (
    <>
      <h3>Подборки</h3>
      <p className="hint">Готовые прогулочные маршруты: достопримечательности, кафе и природа.</p>
      <ChipRow items={PLACE_CATS} active={[collCat]} onToggle={onCollCat} />
      {collections.map((collection) => (
        <button key={collection.id} className="coll-item" onClick={() => onSelect(collection.title)}>
          <img src={collection.img} alt={collection.title} />
          <span className="body">
            <span className="badge">{collection.cat}</span>
            <b>{collection.title}</b>
            <small>{collection.time} · {collection.km}</small>
          </span>
          <span
            className="place-go coll-fav"
            onClick={(e) => { e.stopPropagation(); onToggleFav(collection.id); }}
          >
            <IStar filled={favs.includes(collection.id)} />
          </span>
        </button>
      ))}
      <button className="btn-navy" onClick={onOpenAll}>Открыть все подборки</button>
    </>
  );
}
