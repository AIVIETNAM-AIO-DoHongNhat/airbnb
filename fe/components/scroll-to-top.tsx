"use client";

import { useEffect, useRef, useState } from "react";

const CIRCUMFERENCE = 157.08; // 2πr với r = 25

export default function ScrollToTop() {
  const [show, setShow] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY || document.documentElement.scrollTop;
      setShow(sy > 460);
      const ring = ringRef.current;
      if (ring) {
        const max =
          document.documentElement.scrollHeight - window.innerHeight || 1;
        const pct = Math.min(1, Math.max(0, sy / max));
        ring.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - pct));
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed right-7 bottom-7 z-[80]"
      style={{
        animation:
          "fabIn .5s cubic-bezier(.2,.9,.3,1.5) both, fabIdle 3.6s ease-in-out .6s infinite",
      }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Lên đầu trang"
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/65 bg-white/55 backdrop-blur-[18px] transition-transform duration-300 hover:-translate-y-[3px] hover:scale-110"
        style={{ animation: "fabGlow 2.8s ease-in-out infinite" }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          className="absolute inset-0"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle cx="28" cy="28" r="25" fill="none" stroke="rgba(200,162,74,.2)" strokeWidth="3" />
          <circle
            ref={ringRef}
            cx="28"
            cy="28"
            r="25"
            fill="none"
            stroke="#C8A24A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            style={{ transition: "stroke-dashoffset .12s linear" }}
          />
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E5345" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="relative z-[1]">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
