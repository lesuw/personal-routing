import React from 'react';

// Поле ввода с иконкой слева и опциональным слотом справа.
// Используется в AuthPage (email/пароль/имя) и панелях MapPage.
export default function Field({ icon, value, onChange, placeholder, type = 'text', right }) {
  return (
    <div className="field">
      <span className="ico">{icon}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type} />
      {right}
    </div>
  );
}
