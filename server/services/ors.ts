const ORS_DIRECTIONS_URL = 'https://api.openrouteservice.org/v2/directions';

export interface OrsRouteFeature {
  properties: {
    summary: {
      distance: number;
      duration: number;
    };
  };
  geometry: {
    coordinates: Array<[number, number]>;
  };
}

export interface OrsGeoJson {
  features: OrsRouteFeature[];
}

async function getRoute(coordinates: Array<[number, number]>, profile = 'foot-walking'): Promise<OrsGeoJson> {
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) throw new Error('ORS_API_KEY не задан в .env');

  // Запрашиваем /geojson, чтобы сразу получить массив координат
  const response = await fetch(`${ORS_DIRECTIONS_URL}/${profile}/geojson`, {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      coordinates,              // [[lon, lat], [lon, lat]]
      preference: 'shortest',   // ищем самый короткий
      units: 'm',
      instructions: false,      // текстовые инструкции не нужны
      elevation: false
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`ORS ${response.status}: ${text.slice(0, 200)}`);
  }

  return response.json() as Promise<OrsGeoJson>;
}

export { getRoute };
