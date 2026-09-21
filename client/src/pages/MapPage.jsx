import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { INTEREST_CHIPS, PLACES, COLLECTIONS, DEMO_LINE } from '../data/mock.js';
import {
  ILogo, ISearch, IMenu, IRoute, IUser, IBookmark,
  IPin, IClock, ILeaf, ITree, IVolumeOff, IUsers, IZap,
  IStar, IArrow, IBack, ILocate
} from '../components/icons.jsx';

const pin = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const chipIcon = {
  shade: <ITree />,
  quiet: <IVolumeOff />,
  empty: <ILeaf />,
  crowd: <IUsers />,
  short: <IZap />
};

const PLACE_CATS = ['Все', 'Достопримечательности', 'Кафе', 'Природа'];

function placeIcon(cat) {
  if (cat === 'Кафе') return <IPin />;
  if (cat === 'Природа') return <ITree />;
  return <ILocate />;
}

export default function MapPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState('search'); // search | route | collections | profile
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [placeCat, setPlaceCat] = useState('Все');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [built, setBuilt] = useState(false);
  const [activeChips, setActiveChips] = useState(['shade']);
  const [favs, setFavs] = useState([1, 2]);
  const [collCat, setCollCat] = useState('Все');

  const toggleChip = (id) =>
    setActiveChips((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const rail = [
    { id: 'search', label: 'Поиск', icon: <ISearch /> },
    { id: 'route', label: 'Маршрут', icon: <IRoute /> },
    { id: 'collections', label: 'Подборки', icon: <IBookmark /> },
    { id: 'profile', label: 'Профиль', icon: <IUser /> }
  ];

  const places = PLACES.filter(
    (p) =>
      (placeCat === 'Все' || p.cat === placeCat) &&
      (p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase()))
  );

  const collections = COLLECTIONS.filter((c) => collCat === 'Все' || c.cat === collCat);

  const goToRoute = (dest) => {
    setTo(dest);
    setBuilt(false);
    setTab('route');
  };

  return (
    <div className="app">
        <div className="app-topbar">
          <div className="logo">
            <ILogo />
            RouteMind
          </div>
          <div className="search">
            <div className="search-box">
              <span className="ic"><ISearch /></span>
              <input
                placeholder="Куда хотите отправиться?"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setTab('search'); }}
                onFocus={() => setTab('search')}
              />
            </div>
          </div>
          <div className="top-actions">
            <div className="avatar-dot" onClick={() => setTab('profile')}>А</div>
            <button className="burger" onClick={() => setMenu(!menu)} aria-label="Меню"><IMenu /></button>
            {menu && (
              <div className="dropdown">
                <button onClick={() => nav('/discover')}>Подборки маршрутов</button>
                <button onClick={() => setTab('profile')}>Профиль</button>
                <button onClick={() => nav('/')}>Выйти</button>
              </div>
            )}
          </div>
        </div>

        <div className="app-body">
          <div className="app-rail">
            {rail.map((r) => (
              <button key={r.id} className={tab === r.id ? 'active' : ''} onClick={() => setTab(r.id)}>
                <span className="i">{r.icon}</span>
                {r.label}
              </button>
            ))}
          </div>

          <div className="app-side">
            {tab === 'search' && (
              <>
                <h3>Куда пойдём?</h3>
                <div className="route-input">
                  <span className="ic"><ISearch /></span>
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Место, улица, кафе…" />
                </div>
                <div className="chips">
                  {PLACE_CATS.map((c) => (
                    <button key={c} className={`chip ${placeCat === c ? 'active' : ''}`} onClick={() => setPlaceCat(c)}>{c}</button>
                  ))}
                </div>
                {places.length === 0 && <p className="hint">Ничего не найдено. Попробуйте другой запрос.</p>}
                {places.map((p) => (
                  <button key={p.id} className="place-row" onClick={() => goToRoute(p.title)}>
                    <span className="ic navy">{placeIcon(p.cat)}</span>
                    <span style={{ minWidth: 0 }}>
                      <b>{p.title}</b>
                      <small>{p.address} · {p.cat}</small>
                    </span>
                    <span className="place-go"><IArrow /></span>
                  </button>
                ))}
              </>
            )}

            {tab === 'route' && (
              <>
                <h3>Маршрут</h3>
                <div className="route-input">
                  <span className="ic"><ILocate /></span>
                  <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Откуда — адрес или место" />
                </div>
                <div className="route-input">
                  <span className="ic"><IPin /></span>
                  <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Куда — выберите в поиске" />
                </div>
                <div className="section-label">Интересы</div>
                <div className="chips">
                  {INTEREST_CHIPS.map((c) => (
                    <button key={c.id} className={`chip ${activeChips.includes(c.id) ? 'active' : ''}`} onClick={() => toggleChip(c.id)}>
                      <span className="ic" style={{ display: 'inline-flex', verticalAlign: '-3px', marginRight: 6 }}>{chipIcon[c.id]}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
                <button className="btn-navy" onClick={() => setBuilt(true)} disabled={!to.trim()}>
                  Построить маршрут
                </button>
                {!to.trim() && <p className="hint">Сначала выберите место во вкладке «Поиск».</p>}
                {built && to.trim() && (
                  <div className="route-card">
                    <b>Ваш маршрут</b>
                    <div className="route-row"><span className="ic"><IClock /></span><div><b>2 ч 40 мин</b><small>Время в пути</small></div></div>
                    <div className="route-row"><span className="ic"><IRoute /></span><div><b>6.8 км</b><small>Расстояние</small></div></div>
                    <div className="route-row"><span className="ic"><ILeaf /></span><div><b>Средняя сложность</b><div className="dots"><i className="on" /><i className="on" /><i className="on" /><i /><i /></div></div></div>
                    <p className="hint">Учитываем: {activeChips.length ? activeChips.map((c) => INTEREST_CHIPS.find((x) => x.id === c)?.label).join(' · ') : 'без фильтров'}</p>
                    <button className="btn-navy">Сохранить маршрут</button>
                    <button className="link-btn" onClick={() => { setBuilt(false); setTo(''); }}>Сбросить</button>
                  </div>
                )}
              </>
            )}

            {tab === 'collections' && (
              <>
                <h3>Подборки</h3>
                <p className="hint">Готовые прогулочные маршруты: достопримечательности, кафе и природа.</p>
                <div className="chips">
                  {PLACE_CATS.map((c) => (
                    <button key={c} className={`chip ${collCat === c ? 'active' : ''}`} onClick={() => setCollCat(c)}>{c}</button>
                  ))}
                </div>
                {collections.map((c) => (
                  <button key={c.id} className="coll-item" onClick={() => goToRoute(c.title)}>
                    <img src={c.img} alt={c.title} />
                    <span className="body">
                      <span className="badge">{c.cat}</span>
                      <b>{c.title}</b>
                      <small>{c.time} · {c.km}</small>
                    </span>
                    <span className="place-go" style={{ alignSelf: 'center', marginRight: 10 }}
                      onClick={(e) => { e.stopPropagation(); setFavs((p) => p.includes(c.id) ? p.filter((x) => x !== c.id) : [...p, c.id]); }}>
                      <IStar filled={favs.includes(c.id)} />
                    </span>
                  </button>
                ))}
                <button className="btn-navy" onClick={() => nav('/discover')}>Открыть все подборки</button>
              </>
            )}

            {tab === 'profile' && (
              <>
                <button className="back-link" onClick={() => setTab('search')}><span style={{ display: 'inline-flex', verticalAlign: '-3px', marginRight: 6 }}><IBack /></span>Назад</button>
                <div className="profile-box">
                  <div className="ava">А</div>
                  <b>Анна</b>
                  <div style={{ fontSize: 12, color: '#68798f' }}>anna@routemind.ru · Красноярск</div>
                  <div className="stat-row">
                    <div className="stat">12<br /><span style={{ fontWeight: 600, color: '#68798f' }}>маршрутов</span></div>
                    <div className="stat">48 км<br /><span style={{ fontWeight: 600, color: '#68798f' }}>пройдено</span></div>
                    <div className="stat">{favs.length}<br /><span style={{ fontWeight: 600, color: '#68798f' }}>в избранном</span></div>
                  </div>
                </div>
                <button className="btn-navy" onClick={() => setTab('collections')}>Мои подборки</button>
                <button className="link-btn" onClick={() => nav('/')}>Выйти из аккаунта</button>
              </>
            )}
          </div>

          <div className="app-map">
            <MapContainer center={[56.015, 92.885]} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {built && to.trim() && <Polyline positions={DEMO_LINE} color="#2f4bff" weight={4} />}
              {built && to.trim() && (
                <>
                  <Marker position={DEMO_LINE[0]} icon={pin}><Popup>{from || 'Старт'}</Popup></Marker>
                  <Marker position={DEMO_LINE[DEMO_LINE.length - 1]} icon={pin}><Popup>{to}</Popup></Marker>
                </>
              )}
            </MapContainer>
          </div>
        </div>
    </div>
  );
}
