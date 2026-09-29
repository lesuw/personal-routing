import React from 'react';

// Универсальный ряд чипов.
// items: [{ id, label, icon? }] или ['строка', ...]
// active: массив id активных. onToggle(id) — переключение.
export default function ChipRow({ items, active, onToggle }) {
  const norm = items.map((it) => (typeof it === 'string' ? { id: it, label: it } : it));
  return (
    <div className="chips">
      {norm.map((it) => (
        <button
          key={it.id}
          className={`chip ${active.includes(it.id) ? 'active' : ''}`}
          onClick={() => onToggle(it.id)}
        >
          {it.icon && <span className="ic ic-text">{it.icon}</span>}
          {it.label}
        </button>
      ))}
    </div>
  );
}
