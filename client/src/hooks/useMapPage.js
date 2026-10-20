import { useState } from 'react';
import { INTEREST_CHIPS, PLACES, COLLECTIONS } from '../data/mock.js';
import { api } from '../api/client.js';

// Всё состояние MapPage в одном месте:
// вкладки, поиск мест, конструктор маршрута, подборки, избранное.
export default function useMapPage() {
  const [tab, setTab] = useState('search'); // search | route | collections | profile
  const [query, setQuery] = useState('');
  const [placeCat, setPlaceCat] = useState('Все');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [built, setBuilt] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [activeChips, setActiveChips] = useState(['shade']);
  const [favs, setFavs] = useState([1, 2]);
  const [collCat, setCollCat] = useState('Все');

  const toggleChip = (id) =>
    setActiveChips((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const toggleFav = (id) =>
    setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const places = PLACES.filter(
    (p) =>
      (placeCat === 'Все' || p.cat === placeCat) &&
      (p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase()))
  );

  const collections = COLLECTIONS.filter((c) => collCat === 'Все' || c.cat === collCat);

  const interestsLabel = activeChips.length
    ? activeChips.map((c) => INTEREST_CHIPS.find((x) => x.id === c)?.label).join(' · ')
    : 'без фильтров';

  const goToRoute = (place, role = 'to') => {
    const p = typeof place === 'string' ? PLACES.find((x) => x.title === place) : place;
    if (!p) return;

    if (role === 'from') {
      setFrom(p.title);
      setFromCoords(Array.isArray(p.coords) ? p.coords : null);
    } else {
      setTo(p.title);
      setToCoords(Array.isArray(p.coords) ? p.coords : null);
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
      setRouteError(err.message || 'Не удалось построить маршрут');
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
    fromCoords, toCoords,
    built, setBuilt, canBuild: !!(fromCoords && toCoords), showRoute: built && !!routeData,
    routeData, routeLoading, routeError,
    activeChips, toggleChip, interestsLabel,
    collCat, setCollCat, collections,
    favs, toggleFav,
    goToRoute, resetRoute, onBuildRoute
  };
}
