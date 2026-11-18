import { useState } from 'react';
import { INTEREST_CHIPS, PLACES, COLLECTIONS } from '../data/mock';
import { api } from '../api/client';
import type { Coords, Place, Role, RouteData, Tab } from '../types';

// Всё состояние MapPage в одном месте:
// вкладки, поиск мест, конструктор маршрута, подборки, избранное.
export default function useMapPage() {
  const [tab, setTab] = useState<Tab>('search');
  const [query, setQuery] = useState('');
  const [placeCat, setPlaceCat] = useState('Все');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromCoords, setFromCoords] = useState<Coords | null>(null);
  const [toCoords, setToCoords] = useState<Coords | null>(null);
  const [built, setBuilt] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [activeChips, setActiveChips] = useState<string[]>(['shade']);
  const [favs, setFavs] = useState<number[]>([1, 2]);
  const [collCat, setCollCat] = useState('Все');

  const toggleChip = (id: string) =>
    setActiveChips((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleFav = (id: number) =>
    setFavs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const places = PLACES.filter(
    (place) =>
      (placeCat === 'Все' || place.cat === placeCat) &&
      (place.title.toLowerCase().includes(query.toLowerCase()) ||
        place.address.toLowerCase().includes(query.toLowerCase()))
  );

  const collections = COLLECTIONS.filter((collection) => collCat === 'Все' || collection.cat === collCat);

  const interestsLabel = activeChips.length
    ? activeChips.map((chip) => INTEREST_CHIPS.find((x) => x.id === chip)?.label).filter(Boolean).join(' · ')
    : 'без фильтров';

  const goToRoute = (place: Place | string, role: Role = 'to') => {
    const found = typeof place === 'string' ? PLACES.find((x) => x.title === place) : place;
    if (!found) return;

    if (role === 'from') {
      setFrom(found.title);
      setFromCoords(Array.isArray(found.coords) ? found.coords : null);
    } else {
      setTo(found.title);
      setToCoords(Array.isArray(found.coords) ? found.coords : null);
    }
    setBuilt(false);
    setRouteData(null);
    setRouteError('');
    setTab('route');
  };

  const resetRoute = () => {
    setBuilt(false);
    setRouteData(null);
    setRouteError('');
    setTo('');
    setFromCoords(null);
    setToCoords(null);
  };

  const onBuildRoute = async () => {
    if (!fromCoords || !toCoords) {
      setRouteError('Сначала выберите «Откуда» и «Куда» из списка мест.');
      setBuilt(false);
      setRouteData(null);
      return;
    }

    setRouteLoading(true);
    setRouteError('');
    try {
      const data = await api.buildRoute(fromCoords, toCoords);
      setRouteData(data);
      setBuilt(true);
    } catch (err) {
      setRouteError(err instanceof Error ? err.message : 'Не удалось построить маршрут');
      setBuilt(false);
      setRouteData(null);
    } finally {
      setRouteLoading(false);
    }
  };

  return {
    tab, setTab,
    query, setQuery, placeCat, setPlaceCat, places,
    from, setFrom, to, setTo,
    fromCoords, setFromCoords, toCoords, setToCoords,
    built, setBuilt, canBuild: !!(fromCoords && toCoords), showRoute: built && !!routeData,
    routeData, routeLoading, routeError,
    activeChips, toggleChip, interestsLabel,
    collCat, setCollCat, collections,
    favs, toggleFav,
    goToRoute, resetRoute, onBuildRoute
  };
}
