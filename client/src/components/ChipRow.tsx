import type { ReactNode } from 'react';

interface ChipItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface ChipRowProps {
  items: Array<string | ChipItem>;
  active: string[];
  onToggle: (id: string) => void;
}

// Универсальный ряд чипов.
// items: [{ id, label, icon? }] или ['строка', ...]
// active: массив id активных. onToggle(id) — переключение.
export default function ChipRow({ items, active, onToggle }: ChipRowProps) {
  const norm: ChipItem[] = items.map((item) => (typeof item === 'string' ? { id: item, label: item } : item));
  return (
    <div className="chips">
      {norm.map((item) => {
        const isOn = active.includes(item.id);
        return (
          <button
            key={item.id}
            className={`chip ${isOn ? 'active' : ''} ${item.icon ? 'chip-toggle' : ''}`}
            onClick={() => onToggle(item.id)}
          >
            {item.icon && <span className="ic ic-text">{item.icon}</span>}
            <span className="chip-label">{item.label}</span>
            {item.icon && <span className="switch" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
