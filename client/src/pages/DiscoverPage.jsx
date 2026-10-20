import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DISCOVER_CARDS } from '../data/mock.js';
import Logo from '../components/Logo.jsx';
import ChipRow from '../components/ChipRow.jsx';
import DiscoverCard from '../discover/DiscoverCard.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { IMenu, IBack } from '../components/icons.jsx';

const CATS = ['Природа', 'Культура', 'Гастрономия', 'Активный отдых'];

export default function DiscoverPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [cat, setCat] = useState('Природа');

  return (
    <div className="page" style={{ alignItems: 'flex-start' }}>
      <div className="shell">
        <div className="topbar">
          <Logo onClick={() => nav('/map')} />
          <div className="top-actions">
            <div className="avatar-dot">{(user?.name || 'Г').trim().charAt(0).toUpperCase()}</div>
            <button className="burger" onClick={() => nav('/map')} aria-label="Меню"><IMenu /></button>
          </div>
        </div>

        <div className="discover">
          <button className="back-link" onClick={() => nav('/map')}><span className="ic ic-text"><IBack /></span>Назад на карту</button>
          <h1>Готовы к новым<br />открытиям?</h1>
          <p className="sub">Мы собрали для вас подборку маршрутов на основе ваших интересов.</p>

          <ChipRow items={CATS} active={[cat]} onToggle={setCat} />

          <div className="d-cards">
            {DISCOVER_CARDS.map((card) => (
              <DiscoverCard
                key={card.id}
                card={card}
                tag={cat === 'Природа' ? card.tag : cat}
                onOpen={() => nav('/map')}
              />
            ))}
          </div>

          <div className="d-side">
            <div>Больше<br />впечатлений<br />— ближе,<br />чем кажется</div>
          </div>
        </div>

        <div className="discover-foot">
          <Link to="/map">Вернуться к карте</Link>
        </div>
      </div>
    </div>
  );
}
