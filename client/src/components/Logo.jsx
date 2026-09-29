import React from 'react';
import { ILogo } from './icons.jsx';

export default function Logo({ onClick }) {
  return (
    <div className={`logo${onClick ? ' logo-click' : ''}`} onClick={onClick}>
      <ILogo />
      RouteMind
    </div>
  );
}
