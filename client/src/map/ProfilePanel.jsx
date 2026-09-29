import React from 'react';
import { IBack } from '../components/icons.jsx';

// Вкладка «Профиль»: мок-профиль пользователя.
export default function ProfilePanel({ favCount, onBack, onCollections, onLogout }) {
  return (
    <>
      <button className="back-link" onClick={onBack}><span className="ic ic-text"><IBack /></span>Назад</button>
      <div className="profile-box">
        <div className="ava">А</div>
        <b>Анна</b>
        <div className="profile-sub">anna@routemind.ru · Красноярск</div>
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
