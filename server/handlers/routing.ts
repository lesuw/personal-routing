import type { Request, Response } from 'express';
import { fail } from '../utils/auth';
import { getRoute } from '../services/ors';

interface RouteBody {
  from?: unknown;
  to?: unknown;
  profile?: unknown;
}

interface Difficulty {
  label: string;
  level: number;
}

function formatDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours} ч ${String(minutes).padStart(2, '0')} мин`;
  return `${minutes} мин`;
}

function calcDifficulty(distanceMeters: number): Difficulty {
  const km = distanceMeters / 1000;
  if (km < 3) return { label: 'Лёгкий маршрут', level: 2 };
  if (km < 7) return { label: 'Средняя сложность', level: 3 };
  if (km < 12) return { label: 'Сложный маршрут', level: 4 };
  return { label: 'Очень сложный маршрут', level: 5 };
}

function isPoint(value: unknown): value is [number, number] {
  return Array.isArray(value) && value.length === 2 && value.every((n) => Number.isFinite(n));
}

async function buildRouteHandler(req: Request, res: Response): Promise<Response> {
  const { from, to, profile = 'foot-walking' } = (req.body ?? {}) as RouteBody;

  if (!isPoint(from) || !isPoint(to)) {
    return fail(res, 400, 'from и to должны быть координатами [lat, lon]');
  }

  try {
    // Меняем порядок для ORS (он ждёт [lon, lat])
    const orsCoordinates: Array<[number, number]> = [from, to].map(([lat, lon]): [number, number] => [lon, lat]);

    // Получаем GeoJSON от ORS
    const geojson = await getRoute(orsCoordinates, String(profile));

    // В GeoJSON данные лежат в features[0], а не в routes[0]
    const feature = geojson.features && geojson.features[0];

    if (!feature || !feature.properties) {
      return fail(res, 502, 'ORS не вернул маршрут');
    }

    const summary = feature.properties.summary;
    const coordinates = feature.geometry.coordinates;

    // Меняем порядок обратно для карты ([lat, lon])
    const line: Array<[number, number]> = coordinates.map(([lon, lat]): [number, number] => [lat, lon]);

    const difficulty = calcDifficulty(summary.distance);

    return res.json({
      time: formatDuration(summary.duration),
      distance: `${(summary.distance / 1000).toFixed(1)} км`,
      difficulty: difficulty.label,
      difficultyLevel: difficulty.level,
      line
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[build-route]', message);
    return fail(res, 502, `Не удалось построить маршрут: ${message}`);
  }
}

function healthHandler(_req: Request, res: Response): Response {
  return res.json({ ok: true, service: 'routemind' });
}

export { buildRouteHandler, healthHandler };
