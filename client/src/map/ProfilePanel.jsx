import React from 'react';
import { IBack } from '../components/icons.jsx';

// Вкладка «Профиль»: данные из сессии.
export default function ProfilePanel({ user, favCount, onBack, onCollections, onLogout }) {
  const initial = (user?.name || 'Г').trim().charAt(0).toUpperCase();
  return (
    <>
      <button className="back-link" onClick={onBack}><span className="ic ic-text"><IBack /></span>Назад</button>
      <div className="profile-box">
        <div className="ava">{initial}</div>
        <b>{user?.name || 'Гость'}</b>
        <div className="profile-sub">{user?.email || ''} · Красноярск</div>
        <div className="stat-row">
          <div className="stat">12<br /><span>маршрутов</span></div>
          <div className="stat">48 км<br /><span>пройдено</span></div>
          <div className="stat">{favCount}<br /><span>в избранном</span></div>
        </div>
      </div>
      <button className="btn-navy" onClick={onCollections}>Мои подборки</button>
      <button className="link-btn" onClick={onLogout}>Выйти из аккаунта</button>
    </>
  );
}
