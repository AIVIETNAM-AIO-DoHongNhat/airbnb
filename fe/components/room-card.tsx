"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/providers";
import { fmtVnd, featureLine, locName, pseudoRating } from "@/lib/format";
import type { Phong, ViTri } from "@/lib/types";

const FALLBACK =
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900&q=80&auto=format&fit=crop";

export default function RoomCard({
  room,
  viTriList,
  index = 0,
}: {
  room: Phong;
  viTriList: ViTri[];
  index?: number;
}) {
  const router = useRouter();
  const { isFav, toggleFav } = useApp();
  const fav = isFav(room.id);
  const vt = viTriList.find((v) => v.id === room.viTri);

  return (
    <article
      onClick={() => router.push(`/phong/${room.id}`)}
      className="group cursor-pointer transition-transform duration-300 hover:-translate-y-[7px]"
      style={{
        animation: "fadeUp .55s both",
        animationDelay: `${((index % 4) * 0.07 + 0.04).toFixed(2)}s`,
      }}
    >
      <div className="relative aspect-[1/0.94] overflow-hidden rounded-[18px] bg-[#f0f0f3] shadow-[0_8px_28px_rgba(0,0,0,.1)]">
        <Image
          src={room.hinhAnh || FALLBACK}
          alt={room.tenPhong}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent to-[42%]" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(room.id);
          }}
          aria-label="Lưu yêu thích"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/20 backdrop-blur-[6px] transition-transform hover:scale-110"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={fav ? "#C8A24A" : "rgba(255,255,255,.25)"} stroke="#fff" strokeWidth="2">
            <path d="M12 21s-7.5-4.6-10-9.2C.2 8.3 2 4.5 6 4.5c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3 4 0 5.8 3.8 4 7.3C19.5 16.4 12 21 12 21z" />
          </svg>
        </button>
        <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[12.5px] font-bold text-brand">
          {fmtVnd(room.giaTien)} <span className="font-semibold text-muted">/ đêm</span>
        </div>
      </div>
      <div className="px-1 pt-3">
        <div className="flex items-center justify-between gap-2.5">
          <h3 className="font-display text-[16.5px] leading-tight font-bold tracking-tight">
            {room.tenPhong}
          </h3>
          <span className="flex flex-shrink-0 items-center gap-1 text-sm font-bold">
            <span className="text-gold">★</span>
            {pseudoRating(room.id).toFixed(2)}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-muted">{locName(vt)}</p>
        <p className="mt-0.5 text-[13.5px] text-muted-2">{featureLine(room)}</p>
      </div>
    </article>
  );
}
