import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import useMapPage from '../hooks/useMapPage';
import TopBar from '../components/TopBar';
import Rail from '../components/Rail';
import SearchPanel from '../map/SearchPanel';
import RoutePanel from '../map/RoutePanel';
import CollectionsPanel from '../map/CollectionsPanel';
import ProfilePanel from '../map/ProfilePanel';
import RouteMap from '../map/RouteMap';

// Docked-приложение: шапка + rail + боковая панель + карта.
// Состояние — в useMapPage, вкладки — в map/*, шапка/rail — в components/*.
export default function MapPage() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const s = useMapPage();

  const signOut = async () => {
    await logout();
    nav('/');
  };

  return (
    <div className="app">
      <TopBar
        query={s.query}
        onQuery={(value) => { s.setQuery(value); s.setTab('search'); }}
        onFocusSearch={() => s.setTab('search')}
        onGoProfile={() => s.setTab('profile')}
        onNavigate={(path) => nav(path)}
        initial={(user?.name || 'Г').trim().charAt(0).toUpperCase()}
        name={user?.name || 'Гость'}
        onLogout={signOut}
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
              onFrom={(value) => { s.setFrom(value); s.setFromCoords(null); }}
              to={s.to}
              onTo={(value) => { s.setTo(value); s.setToCoords(null); }}
              places={s.places}
              onSelectFrom={(place) => s.goToRoute(place, 'from')}
              onSelectTo={(place) => s.goToRoute(place, 'to')}
              fromCoords={s.fromCoords}
              toCoords={s.toCoords}
              activeChips={s.activeChips}
              onToggleChip={s.toggleChip}
              interestsLabel={s.interestsLabel}
              canBuild={s.canBuild}
              onBuild={s.onBuildRoute}
              showRoute={s.showRoute}
              routeData={s.routeData}
              routeLoading={s.routeLoading}
              routeError={s.routeError}
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
              user={user}
              favCount={s.favs.length}
              onBack={() => s.setTab('search')}
              onCollections={() => s.setTab('collections')}
              onLogout={signOut}
            />
          )}
        </div>

        <RouteMap
          from={s.from}
          to={s.to}
          visible={s.showRoute}
          line={s.routeData?.line}
          fromCoords={s.fromCoords}
          toCoords={s.toCoords}
          focusPoint={s.tab === 'route' && !s.showRoute ? (s.fromCoords || s.toCoords) : null}
        />
      </div>
    </div>
  );
}
