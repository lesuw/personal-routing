import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { DEMO_LINE } from '../data/mock.js';

const pin = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Карта Leaflet (OSM). Демо-линия рисуется только для построенного маршрута.
export default function RouteMap({ from, to, visible }) {
  return (
    <div className="app-map">
      <MapContainer center={[56.015, 92.885]} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {visible && <Polyline positions={DEMO_LINE} color="#2f4bff" weight={4} />}
        {visible && (
          <>
            <Marker position={DEMO_LINE[0]} icon={pin}><Popup>{from || 'Старт'}</Popup></Marker>
            <Marker position={DEMO_LINE[DEMO_LINE.length - 1]} icon={pin}><Popup>{to}</Popup></Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
}
