import React from 'react';

// Универсальный ряд чипов.
// items: [{ id, label, icon? }] или ['строка', ...]
// active: массив id активных. onToggle(id) — переключение.
export default function ChipRow({ items, active, onToggle }) {
  const norm = items.map((it) => (typeof it === 'string' ? { id: it, label: it } : it));
  return (
    <div className="chips">
      {norm.map((it) => {
        const isOn = active.includes(it.id);
        return (
          <button
            key={it.id}
            className={`chip ${isOn ? 'active' : ''} ${it.icon ? 'chip-toggle' : ''}`}
            onClick={() => onToggle(it.id)}
          >
            {it.icon && <span className="ic ic-text">{it.icon}</span>}
            <span className="chip-label">{it.label}</span>
            {it.icon && <span className="switch" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
