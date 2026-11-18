import type { ReactNode, SVGProps } from 'react';

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};

type IconProps = SVGProps<SVGSVGElement>;

const P = ({ d, children, ...props }: IconProps & { d?: string; children?: ReactNode }) => (
  <svg {...base} {...props}>
    {d ? <path d={d} /> : children}
  </svg>
);

export const ILogo = (p: IconProps) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M3 17L9 6l4 6 3-4 5 9H3z" fill="#a9c47f" />
    <path d="M9 6l2.2 3.4L9 11 7 9.2 9 6z" fill="#eef2e7" />
    <path d="M16 5.5l1.6 2.6L16 9.5l-1.4-1.4L16 5.5z" fill="#7f9e89" />
  </svg>
);

export const ISearch = (p: IconProps) => <P {...p} d="M11 5a6 6 0 104.2 10.3L20 20" />;
export const IMail = (p: IconProps) => (
  <P {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </P>
);
export const ILock = (p: IconProps) => (
  <P {...p}>
    <rect x="5" y="10" width="14" height="10" rx="2.5" />
    <path d="M8 10V7a4 4 0 018 0v3" />
  </P>
);
export const IUser = (p: IconProps) => (
  <P {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c1.4-3.6 4.2-5.2 7.5-5.2s6.1 1.6 7.5 5.2" />
  </P>
);
export const IEye = (p: IconProps) => (
  <P {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </P>
);
export const IEyeOff = (p: IconProps) => <P {...p} d="M3 3l18 18M10 6c.7-.2 1.3-.2 2-.2 6 0 9.5 6.2 9.5 6.2a17 17 0 01-3.3 3.4M6 7.5C3.8 9.3 2.5 12 2.5 12S6 18.5 12 18.5c1.2 0 2.3-.2 3.3-.6" />;
export const IMenu = (p: IconProps) => <P {...p} d="M4 7h16M4 12h16M4 17h16" />;
export const IRoute = (p: IconProps) => (
  <P {...p}>
    <circle cx="6" cy="18" r="2.4" />
    <circle cx="18" cy="6" r="2.4" />
    <path d="M8.4 18H15a3 3 0 000-6H9a3 3 0 010-6h6.6" />
  </P>
);
export const IPin = (p: IconProps) => (
  <P {...p}>
    <path d="M12 21s7-5.8 7-11a7 7 0 10-14 0c0 5.2 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </P>
);
export const IClock = (p: IconProps) => (
  <P {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </P>
);
export const ILeaf = (p: IconProps) => <P {...p} d="M5 19C5 9 13 4 20 4c0 8-5 15-15 15zM5 19c3-5 7-9 11-11" />;
export const ITree = (p: IconProps) => <P {...p} d="M12 3l5 7h-3l4 6h-5v5h-2v-5H6l4-6H7l5-7z" />;
export const IVolumeOff = (p: IconProps) => (
  <P {...p}>
    <path d="M4 10v4h4l5 4V6l-5 4H4z" />
    <path d="M17 9l5 6M22 9l-5 6" />
  </P>
);
export const IUsers = (p: IconProps) => (
  <P {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c1-3.2 3.4-4.8 6-4.8s5 1.6 6 4.8" />
    <path d="M16 5.2a3.2 3.2 0 010 5.9M18.5 15.7c1.4.8 2.3 2 2.9 4.3" />
  </P>
);
export const IZap = (p: IconProps) => <P {...p} d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />;
export const IStar = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.8L12 3.5z" />
  </svg>
);
export const ILocate = (p: IconProps) => (
  <P {...p}>
    <circle cx="12" cy="12" r="6.5" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
  </P>
);
export const IBookmark = (p: IconProps) => (
  <P {...p}>
    <path d="M7 3.5h10a1 1 0 011 1V21l-6-4-6 4V4.5a1 1 0 011-1z" />
  </P>
);
export const IArrow = (p: IconProps) => <P {...p} d="M4 12h15M13 6l6 6-6 6" />;
export const IBack = (p: IconProps) => <P {...p} d="M20 12H5M11 6l-6 6 6 6" />;
export const IBell = (p: IconProps) => (
  <P {...p}>
    <path d="M18 9a6 6 0 10-12 0c0 5-2.2 6.2-2.2 6.2h16.4S18 14 18 9z" />
    <path d="M10.4 19.5a2 2 0 003.2 0" />
  </P>
);
export const IChevronDown = (p: IconProps) => <P {...p} d="M6 9l6 6 6-6" />;
export const IGoogle = (p: IconProps) => (
  <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M21.35 11.1H12v2.9h5.35c-.23 1.5-1.7 4.4-5.35 4.4-3.22 0-5.85-2.66-5.85-5.95S8.78 6.5 12 6.5c1.84 0 3.07.78 3.77 1.45l2.57-2.48C16.72 3.93 14.55 3.1 12 3.1 6.98 3.1 3 7.08 3 12s3.98 8.9 9 8.9c5.2 0 8.65-3.65 8.65-8.8 0-.59-.06-1.04-.15-1z" />
  </svg>
);
