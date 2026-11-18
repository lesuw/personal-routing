import { IClock, IPin, IArrow } from '../components/icons';
import type { DiscoverCardData } from '../types';

interface DiscoverCardProps {
  card: DiscoverCardData;
  tag: string;
  onOpen: () => void;
}

// Карточка подборки маршрута.
export default function DiscoverCard({ card, tag, onOpen }: DiscoverCardProps) {
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
