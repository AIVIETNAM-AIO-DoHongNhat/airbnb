"use client";

import { useEffect, useState } from "react";

/**
 * Màn loading toàn trang hiện ~1s rồi mờ dần — che giai đoạn hydrate/áp animation
 * để người dùng không thấy bất kỳ nhấp nháy nào. Được render sẵn trong HTML server
 * (state khởi tạo = đang hiện) nên phủ ngay từ frame đầu tiên.
 */
export default function Splash() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 200); // giữ ~0.2s
    const t2 = setTimeout(() => setGone(true), 500); // gỡ sau khi fade xong
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden={fading}
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-300 ease-out ${fading ? "pointer-events-none opacity-0" : "opacity-100"}`}
      style={{
        background:
          "radial-gradient(circle at 50% 38%, #0e3b33 0%, #0a2a24 58%, #06201b 100%)",
      }}
    >
      {/* quầng sáng vàng mờ phía sau */}
      <div
        className="pointer-events-none absolute h-[320px] w-[320px] rounded-full blur-[60px]"
        style={{
          background: "radial-gradient(circle, rgba(200,162,74,.22), transparent 70%)",
          animation: "floaty 11s ease-in-out infinite",
        }}
      />

      <div className="relative flex flex-col items-center gap-5" style={{ animation: "fadeUp .6s both" }}>
        {/* logo mark vàng gold */}
        <span
          className="flex h-[70px] w-[70px] items-center justify-center rounded-[22px]"
          style={{
            background: "linear-gradient(135deg,#E3C77E,#C8A24A)",
            boxShadow: "0 18px 44px rgba(200,162,74,.4)",
            animation: "bobble 3s ease-in-out infinite",
          }}
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
            <path d="M3 11.4 12 4l9 7.4V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill="#0a2a24" />
          </svg>
        </span>

        <span className="font-display text-[27px] font-extrabold tracking-tight text-gold">
          airbnb
        </span>

        {/* spinner mảnh */}
        <span className="mt-1 h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-gold" />
      </div>
    </div>
  );
}
