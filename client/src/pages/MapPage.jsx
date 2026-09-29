import React from 'react';
import { useNavigate } from 'react-router-dom';
import useMapPage from '../hooks/useMapPage.js';
import TopBar from '../components/TopBar.jsx';
import Rail from '../components/Rail.jsx';
import SearchPanel from '../map/SearchPanel.jsx';
import RoutePanel from '../map/RoutePanel.jsx';
import CollectionsPanel from '../map/CollectionsPanel.jsx';
import ProfilePanel from '../map/ProfilePanel.jsx';
import RouteMap from '../map/RouteMap.jsx';

// Docked-приложение: шапка + rail + боковая панель + карта.
// Состояние — в useMapPage, вкладки — в map/*, шапка/rail — в components/*.
export default function MapPage() {
  const nav = useNavigate();
  const s = useMapPage();

  return (
    <div className="app">
      <TopBar
        query={s.query}
        onQuery={(v) => { s.setQuery(v); s.setTab('search'); }}
        onFocusSearch={() => s.setTab('search')}
        onGoProfile={() => s.setTab('profile')}
        onNavigate={(path) => nav(path)}
      />

      <div className="app-body">
        <Rail tab={s.tab} onTab={s.setTab} />

        <div className="app-side">
          {s.tab === 'search' && (
            <SearchPanel
              query={s.query}
              onQuery={s.setQuery}
              placeCat={s.placeCat}
              onPlaceCat={s.setPlaceCat}
              places={s.places}
              onSelect={s.goToRoute}
            />
          )}

          {s.tab === 'route' && (
            <RoutePanel
              from={s.from}
              onFrom={s.setFrom}
              to={s.to}
              onTo={s.setTo}
              activeChips={s.activeChips}
              onToggleChip={s.toggleChip}
              interestsLabel={s.interestsLabel}
              canBuild={s.canBuild}
              onBuild={() => s.setBuilt(true)}
              showRoute={s.showRoute}
              onSave={() => {}}
              onReset={s.resetRoute}
            />
          )}

          {s.tab === 'collections' && (
            <CollectionsPanel
              collCat={s.collCat}
              onCollCat={s.setCollCat}
              collections={s.collections}
              favs={s.favs}
              onToggleFav={s.toggleFav}
              onSelect={s.goToRoute}
              onOpenAll={() => nav('/discover')}
            />
          )}

          {s.tab === 'profile' && (
            <ProfilePanel
              favCount={s.favs.length}
              onBack={() => s.setTab('search')}
              onCollections={() => s.setTab('collections')}
              onLogout={() => nav('/')}
            />
          )}
        </div>

        <RouteMap from={s.from} to={s.to} visible={s.showRoute} />
      </div>
    </div>
  );
}
