import React from 'react';
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
  activeChips, onToggleChip, interestsLabel,
  canBuild, onBuild, showRoute, onSave, onReset
}) {
  const items = INTEREST_CHIPS.map((c) => ({ ...c, icon: CHIP_ICONS[c.id] }));
  return (
    <>
      <h3>Маршрут</h3>
      <div className="route-input">
        <span className="ic"><ILocate /></span>
        <input value={from} onChange={(e) => onFrom(e.target.value)} placeholder="Откуда — адрес или место" />
      </div>
      <div className="route-input">
        <span className="ic"><IPin /></span>
        <input value={to} onChange={(e) => onTo(e.target.value)} placeholder="Куда — выберите в поиске" />
      </div>
      <div className="section-label">Интересы</div>
      <ChipRow items={items} active={activeChips} onToggle={onToggleChip} />
      <button className="btn-navy" onClick={onBuild} disabled={!canBuild}>
        Построить маршрут
      </button>
      {!canBuild && <p className="hint">Сначала выберите место во вкладке «Поиск».</p>}
      {showRoute && (
        <RouteCard interestsLabel={interestsLabel} onSave={onSave} onReset={onReset} />
      )}
    </>
  );
}
