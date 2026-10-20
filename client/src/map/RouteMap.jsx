import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const pin = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function MapUpdater({ center, zoom, bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [60, 60] });
      return;
    }
    if (center) {
      map.setView(center, zoom || 14, { animate: true });
    }
  }, [center, zoom, bounds, map]);
  return null;
}

// Карта Leaflet (OSM).
export default function RouteMap({ from, to, visible, line, focusPoint, fromCoords, toCoords }) {
  const positions = visible && Array.isArray(line) && line.length > 0 ? line : null;

  let center = [56.015, 92.885];
  let zoom = 12;
  let bounds = null;

  if (positions) {
    bounds = L.latLngBounds(positions);
  } else if (focusPoint && Array.isArray(focusPoint)) {
    center = focusPoint;
    zoom = 15;
  } else if (fromCoords && Array.isArray(fromCoords)) {
    center = fromCoords;
    zoom = 15;
  } else if (toCoords && Array.isArray(toCoords)) {
    center = toCoords;
    zoom = 15;
  }

  return (
    <div className="app-map">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={positions ? null : center} zoom={zoom} bounds={positions ? bounds : null} />
        {positions && <Polyline positions={positions} color="#2f4bff" weight={4} />}
        {positions && (
          <>
            <Marker position={positions[0]} icon={pin}><Popup>{from || 'Старт'}</Popup></Marker>
            <Marker position={positions[positions.length - 1]} icon={pin}><Popup>{to || 'Финиш'}</Popup></Marker>
          </>
        )}
        {!positions && fromCoords && <Marker position={fromCoords} icon={pin}><Popup>{from || 'Откуда'}</Popup></Marker>}
        {!positions && toCoords && <Marker position={toCoords} icon={pin}><Popup>{to || 'Куда'}</Popup></Marker>}
      </MapContainer>
    </div>
  );
}
