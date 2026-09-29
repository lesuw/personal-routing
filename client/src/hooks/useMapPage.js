import { useState } from 'react';
import { INTEREST_CHIPS, PLACES, COLLECTIONS } from '../data/mock.js';

// Всё состояние MapPage в одном месте:
// вкладки, поиск мест, конструктор маршрута, подборки, избранное.
export default function useMapPage() {
  const [tab, setTab] = useState('search'); // search | route | collections | profile
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

  const goToRoute = (dest) => {
    setTo(dest);
    setBuilt(false);
    setTab('route');
  };

  const resetRoute = () => {
    setBuilt(false);
    setTo('');
  };

  return {
    tab, setTab,
    query, setQuery, placeCat, setPlaceCat, places,
    from, setFrom, to, setTo,
    built, setBuilt, canBuild: !!to.trim(), showRoute: built && !!to.trim(),
    activeChips, toggleChip, interestsLabel,
    collCat, setCollCat, collections,
    favs, toggleFav,
    goToRoute, resetRoute
  };
}
