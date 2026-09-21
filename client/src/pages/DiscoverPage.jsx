import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DISCOVER_CARDS } from '../data/mock.js';
import { ILogo, IMenu, IClock, IPin, IArrow, IBack } from '../components/icons.jsx';

export default function DiscoverPage() {
  const nav = useNavigate();
  const [cat, setCat] = useState('Природа');
  const cats = ['Природа', 'Культура', 'Гастрономия', 'Активный отдых'];

  return (
    <div className="page" style={{ alignItems: 'flex-start' }}>
      <div className="shell">
        <div className="topbar">
          <div className="logo" onClick={() => nav('/map')} style={{ cursor: 'pointer' }}>
            <ILogo />
            RouteMind
          </div>
          <div className="top-actions">
            <div className="avatar-dot">А</div>
            <button className="burger" onClick={() => nav('/map')} aria-label="Меню"><IMenu /></button>
          </div>
        </div>

        <div className="discover">
          <button className="back-link" onClick={() => nav('/map')}><span style={{ display: 'inline-flex', verticalAlign: '-3px', marginRight: 6 }}><IBack /></span>Назад на карту</button>
          <h1>Готовы к новым<br />открытиям?</h1>
          <p className="sub">Мы собрали для вас подборку маршрутов на основе ваших интересов.</p>

          <div className="chips">
            {cats.map((c) => (
              <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>

          <div className="d-cards">
            {DISCOVER_CARDS.map((card) => (
              <div key={card.id} className="d-card">
                <img src={card.img} alt={card.title} />
                <div className="body">
                  <span className="badge">{cat === 'Природа' ? card.tag : cat}</span>
                  <b>{card.title}</b>
                  <div className="d-meta">
                    <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}><IClock />{card.time}</span>
                      <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}><IPin />{card.km}</span>
                    </span>
                    <button className="go" onClick={() => nav('/map')} aria-label="Открыть"><IArrow /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-side">
            <div>Больше<br />впечатлений<br />— ближе,<br />чем кажется</div>
          </div>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: '#8a97a8' }}>
          <Link to="/map">Вернуться к карте</Link>
        </div>
      </div>
    </div>
  );
}
