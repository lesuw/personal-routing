const { fail } = require('../utils/auth.js');
const { getRoute } = require('../services/ors.js');

function formatDuration(seconds) {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours} ч ${String(minutes).padStart(2, '0')} мин`;
  return `${minutes} мин`;
}

function calcDifficulty(distanceMeters) {
  const km = distanceMeters / 1000;
  if (km < 3) return { label: 'Лёгкий маршрут', level: 2 };
  if (km < 7) return { label: 'Средняя сложность', level: 3 };
  if (km < 12) return { label: 'Сложный маршрут', level: 4 };
  return { label: 'Очень сложный маршрут', level: 5 };
}

async function buildRouteHandler(req, res) {
  const { from, to, profile = 'foot-walking' } = req.body || {};

  const validPoint = (p) => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite);
  if (!validPoint(from) || !validPoint(to)) {
    return fail(res, 400, 'from и to должны быть координатами [lat, lon]');
  }

  try {
    // Меняем порядок для ORS (он ждёт [lon, lat])
    const orsCoordinates = [from, to].map(([lat, lon]) => [lon, lat]);
    
    // Получаем GeoJSON от ORS
    const geojson = await getRoute(orsCoordinates, profile);

    // В GeoJSON данные лежат в features[0], а не в routes[0]
    const feature = geojson.features && geojson.features[0];
    
    if (!feature || !feature.properties) {
      return fail(res, 502, 'ORS не вернул маршрут');
    }

    const summary = feature.properties.summary;
    const coordinates = feature.geometry.coordinates;

    // Меняем порядок обратно для Leaflet ([lat, lon])
    const line = coordinates.map(([lon, lat]) => [lat, lon]);

    const difficulty = calcDifficulty(summary.distance);

    res.json({
      time: formatDuration(summary.duration),
      distance: `${(summary.distance / 1000).toFixed(1)} км`,
      difficulty: difficulty.label,
      difficultyLevel: difficulty.level,
      line
    });
  } catch (err) {
    console.error('[build-route]', err.message);
    return fail(res, 502, `Не удалось построить маршрут: ${err.message}`);
  }
}

function healthHandler(req, res) {
  res.json({ ok: true, service: 'routemind' });
}

module.exports = { buildRouteHandler, healthHandler };