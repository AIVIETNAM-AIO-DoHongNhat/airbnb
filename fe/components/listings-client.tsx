"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useApp } from "@/app/providers";
import RoomCard from "@/components/room-card";
import Reveal from "@/components/reveal";
import { locName } from "@/lib/format";
import type { Phong, ViTri } from "@/lib/types";

export default function ListingsClient({
  viTriList,
  phongList,
  initialLoc = null,
}: {
  viTriList: ViTri[];
  phongList: Phong[];
  initialLoc?: number | null;
}) {
  const { flash } = useApp();
  const [selectedLoc, setSelectedLoc] = useState<number | null>(initialLoc);
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const listingsRef = useRef<HTMLElement>(null);

  const list = useMemo(
    () => (selectedLoc ? phongList.filter((r) => r.viTri === selectedLoc) : phongList),
    [selectedLoc, phongList],
  );

  const scrollToListings = () =>
    listingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const doSearch = () => {
    scrollToListings();
    flash(`${list.length} chỗ ở phù hợp`);
  };

  const chips = [{ id: null as number | null, ten: "Tất cả", img: viTriList[0]?.hinhAnh }].concat(
    viTriList.map((v) => ({ id: v.id, ten: v.tenViTri, img: v.hinhAnh })),
  );

  return (
    <div style={{ animation: "fadeIn .4s both" }}>
      {/* HEADER BAND + SEARCH */}
      <section className="relative overflow-hidden px-5 pt-26 pb-12 sm:px-8 lg:px-13 lg:pt-30" style={{ background: "linear-gradient(135deg,#0A2A24 0%,#0E3B33 50%,#06201B 100%)", backgroundSize: "180% 180%", animation: "gradientShift 12s ease infinite" }}>
        <div className="absolute -top-30 -right-15 h-[420px] w-[420px] rounded-full blur-[10px]" style={{ background: "radial-gradient(circle, rgba(255,255,255,.32), transparent 70%)", animation: "floaty 11s ease-in-out infinite" }} />
        <div className="absolute -bottom-40 -left-20 h-[460px] w-[460px] rounded-full blur-[14px]" style={{ background: "radial-gradient(circle, rgba(200,162,74,.45), transparent 70%)", animation: "floaty2 13s ease-in-out infinite" }} />

        <div className="relative mx-auto max-w-[1040px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-[13.5px] font-semibold text-white backdrop-blur-[8px]" style={{ animation: "badgePop .6s both" }}>
            <span className="h-2 w-2 rounded-full bg-white" style={{ animation: "pulseDot 2s ease-in-out infinite" }} />
            Hơn 1.200 chỗ ở độc đáo trên khắp Việt Nam
          </div>
          <h1 className="font-display mt-5 text-[clamp(34px,5vw,58px)] leading-[1.04] font-extrabold tracking-[-1.5px] text-white" style={{ textShadow: "0 8px 40px rgba(0,0,0,.18)", animation: "fadeUp .6s both .08s" }}>
            Tìm chỗ ở cho chuyến đi của bạn
          </h1>

          {/* SEARCH BAR */}
          <div className="mx-auto mt-9 flex max-w-[940px] flex-col items-stretch gap-1 rounded-3xl bg-white p-2.5 shadow-[0_30px_70px_rgba(0,0,0,.28)] md:flex-row" style={{ animation: "scaleIn .55s both .24s" }}>
            <label className="flex flex-[1.4] cursor-pointer flex-col gap-0.5 rounded-2xl px-5 py-3 text-left hover:bg-[#f7f7f9]">
              <span className="text-[11.5px] font-bold tracking-wide text-ink uppercase">Địa điểm</span>
              <select
                value={selectedLoc == null ? "" : String(selectedLoc)}
                onChange={(e) => setSelectedLoc(e.target.value ? Number(e.target.value) : null)}
                className="cursor-pointer bg-transparent text-[15px] font-semibold text-ink outline-none"
              >
                <option value="">Mọi địa điểm</option>
                {viTriList.map((v) => (
                  <option key={v.id} value={v.id}>
                    {locName(v)}
                  </option>
                ))}
              </select>
            </label>
            <div className="my-3 hidden w-px bg-[#ececef] md:block" />
            <label className="flex flex-1 cursor-pointer flex-col gap-0.5 rounded-2xl px-4 py-3 text-left hover:bg-[#f7f7f9]">
              <span className="text-[11.5px] font-bold tracking-wide text-ink uppercase">Nhận phòng</span>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="cursor-pointer bg-transparent text-[15px] font-semibold text-muted outline-none" />
            </label>
            <div className="my-3 hidden w-px bg-[#ececef] md:block" />
            <label className="flex flex-1 cursor-pointer flex-col gap-0.5 rounded-2xl px-4 py-3 text-left hover:bg-[#f7f7f9]">
              <span className="text-[11.5px] font-bold tracking-wide text-ink uppercase">Trả phòng</span>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="cursor-pointer bg-transparent text-[15px] font-semibold text-muted outline-none" />
            </label>
            <div className="my-3 hidden w-px bg-[#ececef] md:block" />
            <div className="flex flex-1 flex-col gap-0.5 rounded-2xl px-4 py-3 text-left">
              <span className="text-[11.5px] font-bold tracking-wide text-ink uppercase">Khách</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setGuests((g) => Math.max(1, g - 1))} className="flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-[#d7d7dd] text-base text-muted">−</button>
                <span className="min-w-3.5 text-center text-[15px] font-bold">{guests}</span>
                <button onClick={() => setGuests((g) => Math.min(16, g + 1))} className="flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-[#d7d7dd] text-base text-muted">+</button>
              </div>
            </div>
            <button onClick={doSearch} className="m-1.5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand to-brand-pink px-6.5 py-3.5 font-bold text-white shadow-[0_10px_24px_rgba(14,59,51,.4)] transition-transform hover:-translate-y-px">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></svg>
              Tìm kiếm
            </button>
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section ref={listingsRef} className="mx-auto max-w-[1320px] scroll-mt-[90px] px-5 pt-10 pb-3 sm:px-8 lg:px-13 lg:pt-14">
        <Reveal>
          <h2 className="font-display text-[clamp(26px,3.2vw,38px)] font-extrabold tracking-[-1px]">Khám phá khắp Việt Nam</h2>
          <p className="mt-2 text-base text-muted">{list.length} chỗ ở tuyệt vời đang chờ bạn</p>
        </Reveal>

        <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
          {chips.map((c) => {
            const active = selectedLoc === c.id;
            return (
              <button
                key={String(c.id)}
                onClick={() => setSelectedLoc(c.id)}
                className={`flex flex-shrink-0 items-center gap-2.5 rounded-full border-[1.5px] py-2 pr-4 pl-2 text-sm font-semibold transition-colors ${active ? "border-brand bg-[#eef3f0] text-brand" : "border-line-2 bg-white text-ink"}`}
              >
                <span className="h-[34px] w-[34px] flex-shrink-0 overflow-hidden rounded-[10px] bg-[#eee]">
                  {c.img && <Image src={c.img} alt={c.ten} width={34} height={34} className="h-full w-full object-cover" />}
                </span>
                <span className="whitespace-nowrap">{c.ten}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pt-4 pb-22 sm:px-8 lg:px-13">
        {list.length === 0 ? (
          <p className="py-20 text-center text-muted">Chưa có chỗ ở cho địa điểm này.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6.5 gap-y-7.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((room, i) => (
              <RoomCard key={room.id} room={room} viTriList={viTriList} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
