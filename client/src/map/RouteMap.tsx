import { useEffect, useMemo, useRef, useState } from 'react';
import { Map as MapLibreMap, Marker, NavigationControl, Popup } from 'maplibre-gl';
import type { GeoJSONSource } from 'maplibre-gl';
import type { Coords } from '../types';

type MapStyle = NonNullable<ConstructorParameters<typeof MapLibreMap>[0]['style']>;

const OSM_STYLE: MapStyle = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
};

const START_CENTER: [number, number] = [92.885, 56.015];

const toLngLat = (coords: Coords): [number, number] => [coords[1], coords[0]];

interface RouteMapProps {
  from: string;
  to: string;
  visible: boolean;
  line?: Coords[];
  focusPoint: Coords | null;
  fromCoords: Coords | null;
  toCoords: Coords | null;
}

// Карта MapLibre (OSM, растровые тайлы). Линия маршрута — GeoJSON-слой.
export default function RouteMap({ from, to, visible, line, focusPoint, fromCoords, toCoords }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [ready, setReady] = useState(false);

  const routeLine = useMemo<Coords[] | null>(
    () => (visible && Array.isArray(line) && line.length > 0 ? line : null),
    [visible, line]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: OSM_STYLE,
      center: START_CENTER,
      zoom: 12,
      scrollZoom: true
    });
    map.addControl(new NavigationControl({ showCompass: false }), 'top-left');

    map.on('load', () => {
      map.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } }
      });
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#788ce3', 'line-width': 5, 'line-opacity': 0.95 }
      });
      setReady(true);
    });

    mapRef.current = map;
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, []);

  // Линия маршрута.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const source = map.getSource('route');
    if (!source || !('setData' in source)) return;

    const coordinates = routeLine ? routeLine.map(toLngLat) : [];
    (source as GeoJSONSource).setData({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates }
    });
  }, [ready, routeLine]);

  // Метки «Откуда»/«Куда» или концов маршрута.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const addMarker = (coords: Coords, label: string) => {
      const marker = new Marker({ color: '#5f7d52' })
        .setLngLat(toLngLat(coords))
        .setPopup(new Popup({ offset: 24 }).setText(label))
        .addTo(map);
      markersRef.current.push(marker);
    };

    if (routeLine && routeLine.length > 0) {
      addMarker(routeLine[0], from || 'Старт');
      addMarker(routeLine[routeLine.length - 1], to || 'Финиш');
      return;
    }
    if (fromCoords) addMarker(fromCoords, from || 'Откуда');
    if (toCoords) addMarker(toCoords, to || 'Куда');
  }, [ready, routeLine, fromCoords, toCoords, from, to]);

  // Приближение к выбранной точке или охват всего маршрута.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    if (routeLine && routeLine.length > 1) {
      let minLng = Infinity;
      let minLat = Infinity;
      let maxLng = -Infinity;
      let maxLat = -Infinity;
      routeLine.forEach(([lat, lng]) => {
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      });
      map.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 60, duration: 800 });
      return;
    }

    const point = focusPoint || fromCoords || toCoords;
    if (point) {
      map.flyTo({ center: toLngLat(point), zoom: 15, duration: 800 });
    }
  }, [ready, routeLine, focusPoint, fromCoords, toCoords]);

  return (
    <div className="app-map">
      <div ref={containerRef} className="map-canvas" />
    </div>
  );
}
