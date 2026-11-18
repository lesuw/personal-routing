import { useState } from 'react';
import type { ReactNode } from 'react';
import ChipRow from '../components/ChipRow';
import RouteCard from '../components/RouteCard';
import { INTEREST_CHIPS } from '../data/mock';
import { ILocate, IPin, ITree, IVolumeOff, ILeaf, IUsers, IZap } from '../components/icons';
import type { Coords, Place, RouteData } from '../types';

const CHIP_ICONS: Record<string, ReactNode> = {
  shade: <ITree />,
  quiet: <IVolumeOff />,
  empty: <ILeaf />,
  crowd: <IUsers />,
  short: <IZap />
};

interface RoutePanelProps {
  from: string;
  onFrom: (value: string) => void;
  to: string;
  onTo: (value: string) => void;
  places?: Place[];
  onSelectFrom?: (place: Place) => void;
  onSelectTo?: (place: Place) => void;
  activeChips: string[];
  onToggleChip: (id: string) => void;
  interestsLabel: string;
  canBuild: boolean;
  onBuild: () => void;
  showRoute: boolean;
  routeData: RouteData | null;
  routeLoading: boolean;
  routeError: string;
  onSave: () => void;
  onReset: () => void;
  fromCoords: Coords | null;
  toCoords: Coords | null;
}

// Вкладка «Маршрут»: откуда/куда + интересы (живут ТОЛЬКО здесь) + результат.
export default function RoutePanel({
  from, onFrom, to, onTo,
  places = [], onSelectFrom, onSelectTo,
  activeChips, onToggleChip, interestsLabel,
  canBuild, onBuild, showRoute, routeData, routeLoading, routeError, onSave, onReset,
  fromCoords, toCoords
}: RoutePanelProps) {
  const items = INTEREST_CHIPS.map((chip) => ({ ...chip, icon: CHIP_ICONS[chip.id] }));
  const [fromFocus, setFromFocus] = useState(false);
  const [toFocus, setToFocus] = useState(false);

  const fromList = places.filter((place) => {
    const q = (from || '').toLowerCase();
    if (!q) return true;
    return place.title.toLowerCase().includes(q) || place.address.toLowerCase().includes(q);
  }).filter((place) => !(fromCoords && place.title === from)).slice(0, 5);

  const toList = places.filter((place) => {
    const q = (to || '').toLowerCase();
    if (!q) return true;
    return place.title.toLowerCase().includes(q) || place.address.toLowerCase().includes(q);
  }).filter((place) => !(toCoords && place.title === to)).slice(0, 5);

  const showFromList = fromFocus && fromList.length > 0 && onSelectFrom;
  const showToList = toFocus && toList.length > 0 && onSelectTo;

  return (
    <>
      <h3>Маршрут</h3>
      <div style={{ position: 'relative' }}>
        <div className="route-input">
          <span className="ic"><ILocate /></span>
          <input
            value={from}
            onChange={(e) => onFrom(e.target.value)}
            onFocus={() => setFromFocus(true)}
            onBlur={() => setTimeout(() => setFromFocus(false), 150)}
            placeholder="Откуда"
            aria-label="Откуда"
          />
        </div>
        {showFromList && (
          <div className="dropdown" style={{ top: 'calc(100% + 4px)', left: 0, right: 0, width: '100%' }}>
            {fromList.map((place) => (
              <button key={place.id} onMouseDown={(e) => e.preventDefault()} onClick={() => { onSelectFrom?.(place); setFromFocus(false); }}>
                <b style={{ display: 'block', fontSize: '13px' }}>{place.title}</b>
                <small style={{ color: 'var(--muted)', fontSize: '12px' }}>{place.address}</small>
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ position: 'relative' }}>
        <div className="route-input">
          <span className="ic"><IPin /></span>
          <input
            value={to}
            onChange={(e) => onTo(e.target.value)}
            onFocus={() => setToFocus(true)}
            onBlur={() => setTimeout(() => setToFocus(false), 150)}
            placeholder="Куда"
            aria-label="Куда"
          />
        </div>
        {showToList && (
          <div className="dropdown" style={{ top: 'calc(100% + 4px)', left: 0, right: 0, width: '100%' }}>
            {toList.map((place) => (
              <button key={place.id} onMouseDown={(e) => e.preventDefault()} onClick={() => { onSelectTo?.(place); setToFocus(false); }}>
                <b style={{ display: 'block', fontSize: '13px' }}>{place.title}</b>
                <small style={{ color: 'var(--muted)', fontSize: '12px' }}>{place.address}</small>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="section-label">Интересы</div>
      <ChipRow items={items} active={activeChips} onToggle={onToggleChip} />
      <button className="btn-navy" onClick={onBuild} disabled={!canBuild || routeLoading}>
        {routeLoading ? 'Построение...' : 'Построить маршрут'}
      </button>
      {!canBuild && <p className="hint">Выберите «Откуда» и «Куда» из списка.</p>}
      {routeError && <p className="hint">{routeError}</p>}
      {showRoute && routeData && (
        <RouteCard routeData={routeData} interestsLabel={interestsLabel} onSave={onSave} onReset={onReset} />
      )}
    </>
  );
}
