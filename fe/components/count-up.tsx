"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Đếm số từ 0 -> target khi khối lọt vào viewport.
 * Hỗ trợ prefix/suffix và số thập phân, định dạng kiểu vi-VN (dấu chấm ngăn nghìn).
 */
export default function CountUp({
  target,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1400,
}: {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let start = 0;

    const run = () => {
      const tick = (now: number) => {
        if (!start) start = now;
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setVal(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setVal(target);
      };
      raf = requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      setVal(target);
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  const text = val.toLocaleString("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
