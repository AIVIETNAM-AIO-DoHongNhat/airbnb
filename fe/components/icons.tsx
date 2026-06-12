import type { ReactNode } from "react";

/**
 * Bộ icon line dùng chung cho toàn site — thay cho emoji.
 * Vẽ trên khung 24×24, stroke = currentColor để thừa hưởng màu chữ.
 */
const PATHS: Record<string, ReactNode> = {
  // ----- Phong cách chỗ ở (CATEGORIES) -----
  beach: (
    <>
      <path d="M12 4v16" />
      <path d="M4.5 12a7.5 7.5 0 0 1 15 0z" />
      <path d="M9 20h6" />
    </>
  ),
  mountain: (
    <>
      <path d="M3 20h18" />
      <path d="m4 20 5.5-10 3.5 6.2" />
      <path d="m11 20 5-9 5 9" />
      <path d="m14.6 8 1.4-2.5 1.5 2.7" />
    </>
  ),
  city: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V9l6-3v15" />
      <path d="M11 21V11l8 2v8" />
      <path d="M8 12h0M8 15h0M8 18h0M15 16h0M15 19h0" />
    </>
  ),
  pool: (
    <>
      <path d="M3 13c1.8 0 1.8 1.5 3.5 1.5S8.3 13 10 13s1.8 1.5 3.5 1.5S15.3 13 17 13s1.8 1.5 3.5 1.5" />
      <path d="M3 18c1.8 0 1.8 1.5 3.5 1.5S8.3 18 10 18s1.8 1.5 3.5 1.5S15.3 18 17 18s1.8 1.5 3.5 1.5" />
      <path d="M8 13V6.5A2.5 2.5 0 0 1 13 6M8 9.5h4.5" />
    </>
  ),
  sunrise: (
    <>
      <path d="M3 18h18" />
      <path d="M7 18a5 5 0 0 1 10 0" />
      <path d="M12 3.5V6M5.2 9.2 4 8M18.8 9.2 20 8M2.5 14H4M20 14h1.5" />
    </>
  ),
  gem: (
    <>
      <path d="M6 3.5h12l3 5L12 21 3 8.5z" />
      <path d="M3 8.5h18" />
      <path d="M8.5 3.5 7 8.5 12 21M15.5 3.5 17 8.5 12 21" />
    </>
  ),

  // ----- Vì sao chọn (FEATURES) -----
  bolt: <path d="M13 3 5.5 13H11l-.8 8 7.8-11.5H12z" />,
  shield: (
    <>
      <path d="M12 3 5 5.8v5.2c0 4.3 2.9 7.4 7 8.9 4.1-1.5 7-4.6 7-8.9V5.8z" />
      <path d="m8.8 11.8 2.2 2.2 4.2-4.4" />
    </>
  ),
  chat: (
    <>
      <path d="M20.5 11.5a7.5 7.5 0 0 1-10.8 6.7L4 20l1.8-4.4A7.5 7.5 0 1 1 20.5 11.5z" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
    </>
  ),
  tag: (
    <>
      <path d="M3.6 11.4 11.4 3.6a2 2 0 0 1 1.4-.6H19a2 2 0 0 1 2 2v6.2a2 2 0 0 1-.6 1.4l-7.8 7.8a2 2 0 0 1-2.8 0L3.6 14.2a2 2 0 0 1 0-2.8z" />
      <path d="M15.5 8.5h.01" />
    </>
  ),

  // ----- Cách đặt phòng (STEPS) -----
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4-4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.2v3.6M16 3.2v3.6" />
      <path d="M7.5 13h2.5M14 13h2.5M7.5 16.5h2.5M14 16.5h2.5" />
    </>
  ),
  luggage: (
    <>
      <rect x="5.5" y="7.5" width="13" height="13" rx="2.5" />
      <path d="M9 7.5V5.2A1.7 1.7 0 0 1 10.7 3.5h2.6A1.7 1.7 0 0 1 15 5.2v2.3" />
      <path d="M9.5 11.5v5M14.5 11.5v5" />
    </>
  ),

  // ----- Khác -----
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </>
  ),

  // ----- Dịch vụ concierge (SERVICES / TIMELINE) -----
  chef: (
    <>
      <path d="M7 14a3.5 3.5 0 0 1-.6-6.95 4 4 0 0 1 7.7-1.4A3.5 3.5 0 0 1 17.6 7 3.5 3.5 0 0 1 17 14" />
      <path d="M7 14h10v3.5a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7 17.5z" />
      <path d="M9.5 14v3M14.5 14v3" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1l1.2-2h6.6L16.5 6h1A2.5 2.5 0 0 1 20 8.5V17a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17z" />
      <circle cx="12" cy="12.5" r="3.3" />
    </>
  ),
  van: (
    <>
      <path d="M3 16.5V9a2 2 0 0 1 2-2h7.5v9.5" />
      <path d="M12.5 9.5H16l3.5 3.5v3.5" />
      <path d="M3 16.5h1.5M9 16.5h6M20.5 16.5H19" />
      <circle cx="6.5" cy="16.8" r="1.9" />
      <circle cx="17.5" cy="16.8" r="1.9" />
    </>
  ),
  spa: (
    <>
      <path d="M12 21c-3.9 0-7-2.8-7-6.5 2.3 0 4.2.9 5.5 2.4" />
      <path d="M12 21c3.9 0 7-2.8 7-6.5-2.3 0-4.2.9-5.5 2.4" />
      <path d="M12 21c-1.6-1.8-2.5-4-2.5-6.5 0-2 .9-3.8 2.5-5 1.6 1.2 2.5 3 2.5 5 0 2.5-.9 4.7-2.5 6.5z" />
    </>
  ),
  map: (
    <>
      <path d="M9 3.5 3.5 6v14.5L9 18l6 2.5 5.5-2.5V3.5L15 6 9 3.5z" />
      <path d="M9 3.5V18M15 6v14.5" />
    </>
  ),
  scooter: (
    <>
      <circle cx="6" cy="17" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path d="M8.5 17h7" />
      <path d="m6 17 4.5-8H13" />
      <path d="M13 9h3.2l1.8 8" />
      <path d="M10.5 9h4" />
    </>
  ),
};

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 24,
  strokeWidth = 1.7,
  className,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name] ?? null}
    </svg>
  );
}
