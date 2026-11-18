import { ILogo } from './icons';

interface LogoProps {
  onClick?: () => void;
}

export default function Logo({ onClick }: LogoProps) {
  return (
    <div className={`logo${onClick ? ' logo-click' : ''}`} onClick={onClick}>
      <ILogo />
      RouteMind
    </div>
  );
}
