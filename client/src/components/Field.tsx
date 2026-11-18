import type { ReactNode } from 'react';

interface FieldProps {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  right?: ReactNode;
}

// Поле ввода с иконкой слева и опциональным слотом справа.
// Используется в AuthPage (email/пароль/имя) и панелях MapPage.
export default function Field({ icon, value, onChange, placeholder, type = 'text', right }: FieldProps) {
  return (
    <div className="field">
      <span className="ico">{icon}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type} />
      {right}
    </div>
  );
}
