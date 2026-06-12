"use client";

import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/app/providers";
import Reveal from "@/components/reveal";

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const EXPERIENCES = [
  { no: "01", title: "Ẩm thực địa phương", desc: "Food tour chợ đêm, lớp nấu ăn cùng đầu bếp bản địa.", pic: "1414235077428-338989a2e8c0", accent: "#E3C77E" },
  { no: "02", title: "Phiêu lưu ngoài trời", desc: "Trekking săn mây, leo núi, vượt thác cùng porter địa phương.", pic: "1551632811-561732d1e306", accent: "#7FB89E" },
  { no: "03", title: "Văn hoá & lịch sử", desc: "Di sản, làng nghề trăm tuổi và những câu chuyện chưa kể.", pic: "1528127269322-539801943592", accent: "#D8B45E" },
  { no: "04", title: "Nghệ thuật & thủ công", desc: "Workshop gốm, vẽ tranh, nhiếp ảnh phim cùng nghệ nhân.", pic: "1513364776144-60967b0f800f", accent: "#9FD9C4" },
  { no: "05", title: "Trên mặt nước", desc: "Du thuyền hoàng hôn, lặn san hô, chèo kayak vịnh đêm.", pic: "1502933691298-84fc14542831", accent: "#3FB7A0" },
  { no: "06", title: "Sống về đêm", desc: "Jazz bar ẩn, chợ đêm và city tour dưới ánh đèn neon.", pic: "1514525253161-7a46d19cd819", accent: "#C8A24A" },
];

const REASONS = [
  { no: "01", title: "Host là người bản địa", desc: "Không phải hướng dẫn viên thuộc lòng kịch bản — họ dẫn bạn đến nơi chính họ lớn lên, ăn quán họ ăn mỗi sáng." },
  { no: "02", title: "Nhóm nhỏ, chất riêng", desc: "Tối đa 8 khách mỗi trải nghiệm. Đủ nhỏ để trò chuyện, đủ riêng để hành trình là của bạn." },
  { no: "03", title: "Đặt cùng chỗ ở", desc: "Trải nghiệm gắn liền nơi bạn lưu trú — một hoá đơn, một lịch trình, không phải mở mười tab để lên kế hoạch." },
];

const MARQUEE_WORDS = ["Ẩm thực", "Phiêu lưu", "Văn hoá", "Nghệ thuật", "Biển cả", "Về đêm"];

/* Polaroid trôi nổi trong hero */
function Polaroid({
  pic,
  caption,
  className,
  rotate,
  delay,
}: {
  pic: string;
  caption: string;
  className: string;
  rotate: number;
  delay: string;
}) {
  return (
    <div
      className={`absolute rounded-2xl bg-white p-2 pb-7 shadow-[0_24px_60px_rgba(0,0,0,.45)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, animation: `bobble 6s ease-in-out ${delay} infinite` }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <Image src={img(pic, 480)} alt={caption} fill sizes="240px" className="object-cover" />
      </div>
      <span className="absolute bottom-1.5 left-0 w-full text-center font-display text-[11px] font-bold tracking-wide text-ink">
        {caption}
      </span>
    </div>
  );
}

export default function TraiNghiemPage() {
  const { flash } = useApp();

  return (
    <div className="bg-[#0B0B10] text-white" style={{ animation: "fadeIn .4s both" }}>
      {/* ===== HERO — cinematic ===== */}
      <section className="relative overflow-hidden px-5 pt-16 pb-20 sm:px-8 lg:px-13 lg:pt-24 lg:pb-28">
        {/* glow nền */}
        <div className="absolute -top-40 left-[10%] h-[480px] w-[480px] rounded-full blur-[60px]" style={{ background: "radial-gradient(circle, rgba(200,162,74,.32), transparent 70%)", animation: "floaty 13s ease-in-out infinite" }} />
        <div className="absolute -right-30 bottom-0 h-[420px] w-[420px] rounded-full blur-[70px]" style={{ background: "radial-gradient(circle, rgba(28,138,110,.42), transparent 70%)", animation: "floaty2 15s ease-in-out infinite" }} />
        <div className="absolute top-1/3 right-[38%] h-[200px] w-[200px] rounded-full blur-[50px]" style={{ background: "radial-gradient(circle, rgba(255,209,92,.25), transparent 70%)", animation: "floaty3 10s ease-in-out infinite" }} />
        {/* lưới chấm mờ tạo chất phim */}
        <div className="pointer-events-none absolute inset-0 opacity-[.07]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />

        <div className="relative mx-auto flex max-w-[1320px] flex-col items-center gap-14 lg:flex-row">
          {/* trái: typography */}
          <div className="max-w-[640px] flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold tracking-wide text-white/90 backdrop-blur-[8px]" style={{ animation: "badgePop .6s both" }}>
              <span className="h-2 w-2 rounded-full bg-[#FFD15C]" style={{ animation: "pulseDot 2s ease-in-out infinite" }} />
              TUYỂN TẬP TRẢI NGHIỆM · MÙA HÈ 2026
            </div>
            <h1 className="font-display mt-6 text-[clamp(44px,6.6vw,84px)] leading-[0.98] font-extrabold tracking-[-2.5px]" style={{ animation: "fadeUp .6s both .08s" }}>
              Đi như
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg,#C8A24A 10%,#F6E3AC 45%,#1C8A6E 80%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  animation: "shimmer 5s linear infinite",
                }}
              >
                người bản địa.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-[480px] text-[clamp(15px,1.5vw,18px)] leading-relaxed text-white/65 lg:mx-0" style={{ animation: "fadeUp .6s both .16s" }}>
              Quên những tour đại trà. Đây là những buổi chiều học nấu bún chả trong căn bếp gia đình, những đêm chèo kayak dưới trời sao — do chính người bản địa dẫn lối.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start" style={{ animation: "fadeUp .6s both .24s" }}>
              <a href="#danh-muc" className="rounded-full bg-white px-7 py-3.5 font-display text-[15px] font-extrabold text-ink shadow-[0_14px_34px_rgba(255,255,255,.18)] transition-transform hover:-translate-y-0.5 hover:scale-[1.03]">
                Khám phá tuyển tập ↓
              </a>
              <Link href="/" className="rounded-full border border-white/25 px-7 py-3.5 text-[15px] font-bold text-white/90 transition-colors hover:bg-white/10">
                Tìm chỗ ở trước
              </Link>
            </div>
          </div>

          {/* phải: polaroid collage */}
          <div className="relative hidden h-[460px] w-[440px] flex-shrink-0 lg:block" style={{ animation: "fadeIn .8s both .2s" }}>
            <Polaroid pic="1551632811-561732d1e306" caption="SA PA · 4:50 AM" className="top-0 left-2 h-[250px] w-[200px]" rotate={-7} delay="0s" />
            <Polaroid pic="1414235077428-338989a2e8c0" caption="FOOD TOUR · HÀ NỘI" className="top-10 right-0 h-[280px] w-[220px]" rotate={5} delay="-2s" />
            <Polaroid pic="1502933691298-84fc14542831" caption="PHÚ QUỐC · HOÀNG HÔN" className="bottom-0 left-16 h-[230px] w-[240px]" rotate={-3} delay="-4s" />
            {/* tem sticker */}
            <div className="absolute -right-2 bottom-14 flex h-20 w-20 items-center justify-center rounded-full text-center font-display text-[10px] font-extrabold tracking-wider text-ink" style={{ background: "#FFD15C", transform: "rotate(12deg)", animation: "spinIn .7s both .6s", boxShadow: "0 12px 30px rgba(255,209,92,.4)" }}>
              100%
              <br />
              LOCAL
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE chữ outline ===== */}
      <div className="overflow-hidden border-y border-white/10 py-5">
        <div className="flex w-max items-center gap-12" style={{ animation: "marquee 28s linear infinite" }}>
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
            <span key={i} className="font-display flex items-center gap-12 text-[44px] font-extrabold tracking-[-1px] whitespace-nowrap uppercase">
              <span style={i % 2 ? { color: "#fff" } : { WebkitTextStroke: "1.5px rgba(255,255,255,.35)", color: "transparent" }}>{w}</span>
              <span className="text-[20px] text-brand">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== FILM STRIP — cuộn ngang ===== */}
      <section id="danh-muc" className="scroll-mt-24 py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-13">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-display text-[13px] font-bold tracking-[3px] text-brand uppercase">Tuyển tập 06</span>
              <h2 className="font-display mt-2 text-[clamp(28px,3.6vw,46px)] leading-[1.05] font-extrabold tracking-[-1.5px]">
                Chọn chất riêng
                <br />
                cho chuyến đi của bạn
              </h2>
            </div>
            <p className="max-w-[280px] text-[13.5px] leading-relaxed font-medium text-white/50">
              Sáu chủ đề tuyển chọn cho mọi gu xê dịch — tất cả sắp ra mắt.
            </p>
          </Reveal>

          <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((e, i) => (
            <button
              key={e.no}
              onClick={() => flash(`"${e.title}" sắp ra mắt — cảm ơn bạn đã quan tâm! ✨`)}
              className="group relative aspect-[4/5] w-full overflow-hidden rounded-[22px] text-left"
              style={{ animation: `fadeUp .6s both ${0.05 + i * 0.06}s` }}
            >
              <Image src={img(e.pic)} alt={e.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.08]" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,5,10,.92) 8%, rgba(5,5,10,.25) 45%, rgba(5,5,10,.15))" }} />
              {/* viền accent khi hover */}
              <div className="absolute inset-0 rounded-[22px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: `inset 0 0 0 2px ${e.accent}` }} />
              <span className="absolute top-4 left-4 font-display text-[13px] font-extrabold tracking-wider" style={{ color: e.accent }}>{e.no}</span>
              <span className="absolute top-4 right-4 rounded-full border border-white/25 bg-black/30 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white/85 backdrop-blur-[6px]">SẮP RA MẮT</span>
              <div className="absolute inset-x-4 bottom-4">
                <h3 className="font-display text-[19px] leading-[1.12] font-extrabold tracking-[-.4px]">{e.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/65">{e.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold transition-transform duration-300 group-hover:translate-x-1" style={{ color: e.accent }}>
                  Nhận thông báo
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </div>
            </button>
          ))}
          </div>
        </div>
      </section>

      {/* ===== EDITORIAL — 3 lý do ===== */}
      <section className="border-t border-white/10 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:px-13">
          <Reveal>
            <span className="font-display text-[13px] font-bold tracking-[3px] text-brand uppercase">Tại sao khác biệt</span>
            <h2 className="font-display mt-3 text-[clamp(28px,3.4vw,42px)] leading-[1.08] font-extrabold tracking-[-1.2px]">
              Không phải tour.
              <br />
              Là một <span className="text-[#FFD15C]">lời mời</span>.
            </h2>
            <p className="mt-5 max-w-[380px] text-[15.5px] leading-relaxed text-white/55">
              Mỗi trải nghiệm là một cánh cửa vào đời sống thật của điểm đến — thứ không cuốn cẩm nang nào in nổi.
            </p>
          </Reveal>
          <div className="flex flex-col">
            {REASONS.map((r, i) => (
              <Reveal key={r.no} delay={i * 100} className="group flex gap-7 border-b border-white/10 py-8 first:pt-0 last:border-0">
                <span className="font-display text-[52px] leading-none font-extrabold text-white/12 transition-colors duration-300 group-hover:text-brand">{r.no}</span>
                <div>
                  <h3 className="font-display text-[20px] font-bold tracking-[-.3px]">{r.title}</h3>
                  <p className="mt-2 max-w-[520px] text-[14.5px] leading-relaxed text-white/55">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA — vé boarding pass ===== */}
      <section className="px-5 pb-20 sm:px-8 lg:px-13 lg:pb-28">
        <Reveal className="relative mx-auto max-w-[900px]">
          <div className="absolute -inset-8 rounded-[40px] blur-[50px]" style={{ background: "radial-gradient(ellipse, rgba(200,162,74,.22), transparent 70%)" }} />
          <div className="relative overflow-hidden rounded-[28px] border border-dashed border-white/25 bg-white/[.04] px-8 py-11 text-center backdrop-blur-[10px] lg:px-16">
            {/* hai khấc vé */}
            <span className="absolute top-1/2 -left-4 h-8 w-8 -translate-y-1/2 rounded-full bg-[#0B0B10]" />
            <span className="absolute top-1/2 -right-4 h-8 w-8 -translate-y-1/2 rounded-full bg-[#0B0B10]" />
            <span className="font-display text-[12px] font-bold tracking-[4px] text-[#FFD15C] uppercase">Boarding pass · Sắp khởi hành</span>
            <h2 className="font-display mt-3 text-[clamp(26px,3.4vw,40px)] font-extrabold tracking-[-1px]">Giữ một ghế cho chuyến phiêu lưu</h2>
            <p className="mx-auto mt-3 max-w-[460px] text-[15px] text-white/60">Đăng ký nhận tin — chúng tôi sẽ báo ngay khi tuyển tập trải nghiệm mở đặt chỗ.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button onClick={() => flash("Đã giữ chỗ! Hẹn gặp bạn ở chuyến đi sắp tới 🎫")} className="rounded-full bg-gradient-to-r from-brand to-brand-pink px-8 py-3.5 font-display text-[15px] font-extrabold text-white shadow-[0_14px_34px_rgba(14,59,51,.5)] transition-transform hover:-translate-y-0.5">
                Giữ chỗ của tôi
              </button>
              <Link href="/" className="rounded-full border border-white/25 px-8 py-3.5 text-[15px] font-bold text-white/90 transition-colors hover:bg-white/10">
                Xem chỗ ở
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
