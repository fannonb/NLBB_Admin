import React from 'react';

type IconProps = {
  className?: string;
};

const Svg = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const NavIcons = {
  overview: (props: IconProps) => (
    <Svg {...props}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </Svg>
  ),
  providers: (props: IconProps) => (
    <Svg {...props}>
      <path d="M4 20v-1.2A3.8 3.8 0 0 1 7.8 15h2.4" />
      <circle cx="9" cy="8" r="3" />
      <path d="M14 20v-1.1A3.4 3.4 0 0 1 17.4 15.5H20" />
      <circle cx="17.5" cy="8.5" r="2.5" />
    </Svg>
  ),
  categories: (props: IconProps) => (
    <Svg {...props}>
      <path d="M4 7h6" />
      <path d="M4 12h10" />
      <path d="M4 17h8" />
      <circle cx="18.5" cy="7" r="1.7" />
      <circle cx="18.5" cy="17" r="1.7" />
    </Svg>
  ),
  users: (props: IconProps) => (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M14.8 19.2c.5-1.8 1.9-2.9 3.7-2.9.7 0 1.4.2 2 .5" />
    </Svg>
  ),
  revenue: (props: IconProps) => (
    <Svg {...props}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 16V11" />
      <path d="M12 16V8" />
      <path d="M16 16v-3" />
      <path d="M8 8l4-3 4 2" />
    </Svg>
  ),
  home: (props: IconProps) => (
    <Svg {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M7 10.5V20h10v-9.5" />
    </Svg>
  ),
  explore: (props: IconProps) => (
    <Svg {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16.2 16.2 3.3 3.3" />
    </Svg>
  ),
  book: (props: IconProps) => (
    <Svg {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </Svg>
  ),
  bookings: (props: IconProps) => (
    <Svg {...props}>
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </Svg>
  ),
  profile: (props: IconProps) => (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19.5c1-3.4 3.4-5 7-5s6 1.6 7 5" />
    </Svg>
  ),
  appointments: (props: IconProps) => (
    <Svg {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
      <path d="m9.5 14.5 1.8 1.8 3.7-3.8" />
    </Svg>
  ),
  services: (props: IconProps) => (
    <Svg {...props}>
      <path d="M14.5 4.5 19.5 9.5" />
      <path d="M12.5 6.5 4.8 14.2a2 2 0 0 0 0 2.8L7 19.2a2 2 0 0 0 2.8 0L17.5 11.5" />
      <path d="M16 8l2.5-2.5" />
    </Svg>
  ),
  reviews: (props: IconProps) => (
    <Svg {...props}>
      <path d="m12 4.5 1.9 3.9 4.3.6-3.1 3 0.7 4.3L12 14.5l-3.8 2 0.7-4.3-3.1-3 4.3-.6z" />
    </Svg>
  ),
  dashboard: (props: IconProps) => (
    <Svg {...props}>
      <path d="M4 13h6V4H4z" />
      <path d="M14 20h6V10h-6z" />
      <path d="M4 20h6v-5H4z" />
      <path d="M14 7h6V4h-6z" />
    </Svg>
  ),
} as const;

export type NavIconKey = keyof typeof NavIcons;
