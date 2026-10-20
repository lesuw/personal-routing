import React, { useState } from 'react';
import ChipRow from '../components/ChipRow.jsx';
import RouteCard from '../components/RouteCard.jsx';
import { INTEREST_CHIPS } from '../data/mock.js';
import { ILocate, IPin, ITree, IVolumeOff, ILeaf, IUsers, IZap } from '../components/icons.jsx';

const CHIP_ICONS = {
  shade: <ITree />,
  quiet: <IVolumeOff />,
  empty: <ILeaf />,
  crowd: <IUsers />,
  short: <IZap />
};

// Вкладка «Маршрут»: откуда/куда + интересы (живут ТОЛЬКО здесь) + результат.
export default function RoutePanel({
  from, onFrom, to, onTo,
  places = [], onSelectFrom, onSelectTo,
  activeChips, onToggleChip, interestsLabel,
  canBuild, onBuild, showRoute, routeData, routeLoading, routeError, onSave, onReset,
  fromCoords, toCoords
}) {
  const items = INTEREST_CHIPS.map((c) => ({ ...c, icon: CHIP_ICONS[c.id] }));
  const [fromFocus, setFromFocus] = useState(false);
  const [toFocus, setToFocus] = useState(false);

    const fromList = places.filter((p) => {
    const q = (from || '').toLowerCase();
    if (!q) return true;
    return p.title?.toLowerCase().includes(q) || p.address?.toLowerCase().includes(q);
  }).filter((p) => !(fromCoords && p.title === from)).slice(0, 5);

    const toList = places.filter((p) => {
    const q = (to || '').toLowerCase();
    if (!q) return true;
    return p.title?.toLowerCase().includes(q) || p.address?.toLowerCase().includes(q);
  }).filter((p) => !(toCoords && p.title === to)).slice(0, 5);

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
          />
        </div>
        {showFromList && (
          <div className="dropdown" style={{ top: 'calc(100% + 4px)', left: 0, right: 0, width: '100%' }}>
            {fromList.map((p) => (
              <button key={p.id} onMouseDown={(e) => e.preventDefault()} onClick={() => { onSelectFrom(p); setFromFocus(false); }}>
                <b style={{ display: 'block', fontSize: '13px' }}>{p.title}</b>
                <small style={{ color: 'var(--muted)', fontSize: '12px' }}>{p.address}</small>
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
          />
        </div>
        {showToList && (
          <div className="dropdown" style={{ top: 'calc(100% + 4px)', left: 0, right: 0, width: '100%' }}>
            {toList.map((p) => (
              <button key={p.id} onMouseDown={(e) => e.preventDefault()} onClick={() => { onSelectTo(p); setToFocus(false); }}>
                <b style={{ display: 'block', fontSize: '13px' }}>{p.title}</b>
                <small style={{ color: 'var(--muted)', fontSize: '12px' }}>{p.address}</small>
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
