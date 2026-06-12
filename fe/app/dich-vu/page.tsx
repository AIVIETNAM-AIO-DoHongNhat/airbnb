"use client";

import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/app/providers";
import Reveal from "@/components/reveal";
import CountUp from "@/components/count-up";
import { Icon } from "@/components/icons";
import { fmtVnd } from "@/lib/format";

const EMERALD = "#0E3B33";
const GOLD = "#C8A24A";

const SERVICES = [
  { icon: "chef", title: "Đầu bếp riêng", desc: "Thực đơn riêng cho bữa tối của bạn, nấu ngay tại căn bếp nơi bạn ở.", from: 500000 },
  { icon: "camera", title: "Nhiếp ảnh gia", desc: "Bộ ảnh kỳ nghỉ chỉn chu tại những góc đẹp nhất.", from: 800000 },
  { icon: "van", title: "Đưa đón sân bay", desc: "Xe riêng chờ sẵn, theo dõi giờ bay tự động.", from: 250000 },
  { icon: "spa", title: "Spa tại phòng", desc: "Liệu trình thư giãn ngay trong không gian của bạn.", from: 350000 },
  { icon: "map", title: "Hướng dẫn viên", desc: "Người bản xứ đồng hành theo lịch trình riêng.", from: 600000 },
  { icon: "scooter", title: "Thuê xe tận nơi", desc: "Xe máy, ô tô giao đến tận cửa chỗ ở.", from: 150000 },
];

const TIMELINE = [
  { time: "07:30", title: "Xe đón tại sân bay", desc: "Tài xế chờ sẵn ở sảnh đến, hành lý đã có người lo. Về thẳng chỗ ở, không chờ đợi.", icon: "van" },
  { time: "12:00", title: "Bếp trưởng ghé thăm", desc: "Bữa trưa đặc sản địa phương được chuẩn bị ngay tại bếp — bạn chỉ việc ngồi vào bàn.", icon: "chef" },
  { time: "16:00", title: "Buổi chụp hoàng hôn", desc: "Nhiếp ảnh gia dẫn bạn tới góc máy đẹp nhất thành phố đúng giờ vàng.", icon: "camera" },
  { time: "20:30", title: "Spa thư giãn tại phòng", desc: "Kết thúc ngày dài bằng 60 phút liệu trình ngay tại phòng. Ngủ thật sâu.", icon: "spa" },
];

export default function DichVuPage() {
  const { flash } = useApp();

  return (
    <div className="bg-[#FAF7F0] text-[#1c2a26]" style={{ animation: "fadeIn .4s both" }}>
      {/* ===== HERO — concierge split ===== */}
      <section className="relative overflow-hidden px-5 pt-14 pb-16 sm:px-8 lg:px-13 lg:pt-20 lg:pb-24">
        {/* hoạ tiết nền thanh lịch */}
        <div className="pointer-events-none absolute inset-0 opacity-[.5]" style={{ backgroundImage: `radial-gradient(${GOLD}22 1px, transparent 1px)`, backgroundSize: "34px 34px" }} />
        <div className="absolute -top-30 -right-20 h-[400px] w-[400px] rounded-full blur-[60px]" style={{ background: "radial-gradient(circle, rgba(200,162,74,.22), transparent 70%)", animation: "floaty 13s ease-in-out infinite" }} />
        <div className="absolute -bottom-30 left-[5%] h-[360px] w-[360px] rounded-full blur-[60px]" style={{ background: "radial-gradient(circle, rgba(14,140,124,.16), transparent 70%)", animation: "floaty2 15s ease-in-out infinite" }} />

        <div className="relative mx-auto flex max-w-[1320px] flex-col items-center gap-14 lg:flex-row">
          {/* trái */}
          <div className="max-w-[620px] flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[12.5px] font-bold tracking-[2px] uppercase" style={{ borderColor: `${GOLD}66`, color: EMERALD, background: "#fff" }}>
              <span className="h-2 w-2 rounded-full" style={{ background: GOLD, animation: "pulseDot 2s ease-in-out infinite" }} />
              Concierge · Phục vụ tận nơi
            </div>
            <h1 className="font-display mt-6 text-[clamp(40px,6vw,76px)] leading-[1.0] font-extrabold tracking-[-2px]" style={{ color: EMERALD, animation: "fadeUp .6s both .08s" }}>
              Kỳ nghỉ
              <br />
              chuẩn <em className="not-italic" style={{ color: GOLD }}>khách sạn 5 sao</em>,
              <br />
              ngay tại homestay.
            </h1>
            <p className="mx-auto mt-6 max-w-[460px] text-[clamp(15px,1.5vw,18px)] leading-relaxed text-[#5d6b66] lg:mx-0" style={{ animation: "fadeUp .6s both .16s" }}>
              Đội ngũ concierge sắp xếp mọi thứ — từ đầu bếp riêng đến xe đón sân bay — để bạn chỉ việc tận hưởng.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start" style={{ animation: "fadeUp .6s both .24s" }}>
              <a href="#bang-dich-vu" className="rounded-[14px] px-7 py-3.5 font-display text-[15px] font-extrabold text-white shadow-[0_14px_34px_rgba(14,59,51,.35)] transition-transform hover:-translate-y-0.5" style={{ background: EMERALD }}>
                Xem bảng dịch vụ ↓
              </a>
              <Link href="/phong" className="rounded-[14px] border bg-white px-7 py-3.5 text-[15px] font-bold transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,.08)]" style={{ borderColor: `${EMERALD}33`, color: EMERALD }}>
                Đặt chỗ ở trước
              </Link>
            </div>

            {/* stats nhỏ */}
            <div className="mt-10 flex justify-center gap-9 lg:justify-start" style={{ animation: "fadeUp .6s both .3s" }}>
              {[
                { v: 120, s: "+", label: "đối tác xác minh" },
                { v: 4.9, s: "", d: 1, label: "điểm hài lòng" },
                { v: 12, s: "K+", label: "lượt phục vụ" },
              ].map((x) => (
                <div key={x.label}>
                  <div className="font-display text-[28px] leading-none font-extrabold" style={{ color: EMERALD }}>
                    <CountUp target={x.v} decimals={x.d ?? 0} suffix={x.s} />
                  </div>
                  <div className="mt-1.5 text-[12.5px] font-semibold tracking-wide text-[#8a958f] uppercase">{x.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* phải: thẻ dịch vụ xếp chồng kiểu hoá đơn khách sạn */}
          <div className="relative hidden h-[470px] w-[430px] flex-shrink-0 lg:block" style={{ animation: "fadeIn .8s both .2s" }}>
            <div className="absolute top-0 right-4 h-[300px] w-[260px] overflow-hidden rounded-[22px] shadow-[0_30px_70px_rgba(14,59,51,.3)]" style={{ transform: "rotate(4deg)", animation: "bobble 7s ease-in-out infinite" }}>
              <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop" alt="Đầu bếp riêng" fill sizes="260px" className="object-cover" />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 font-display text-[12px] font-extrabold" style={{ color: EMERALD }}><Icon name="chef" size={15} strokeWidth={2} /> Bếp trưởng đang chuẩn bị…</span>
            </div>
            {/* thẻ receipt */}
            <div className="absolute bottom-6 left-0 w-[270px] rounded-[20px] bg-white p-5 shadow-[0_24px_60px_rgba(14,59,51,.22)]" style={{ transform: "rotate(-4deg)", animation: "bobble 7s ease-in-out -3s infinite" }}>
              <div className="flex items-center justify-between border-b border-dashed pb-3" style={{ borderColor: `${EMERALD}22` }}>
                <span className="font-display text-[13px] font-extrabold tracking-[2px] uppercase" style={{ color: EMERALD }}>Concierge</span>
                <span className="text-[11px] font-bold" style={{ color: GOLD }}>#A2026</span>
              </div>
              {[
                { icon: "van", l: "Đón sân bay", t: "07:30" },
                { icon: "chef", l: "Bữa tối riêng", t: "19:00" },
                { icon: "spa", l: "Spa tại phòng", t: "20:30" },
              ].map((r) => (
                <div key={r.l} className="flex items-center justify-between py-2.5 text-[13.5px] font-semibold text-[#41504a]">
                  <span className="inline-flex items-center gap-2"><Icon name={r.icon} size={16} strokeWidth={1.9} /> {r.l}</span>
                  <span className="font-bold" style={{ color: EMERALD }}>{r.t}</span>
                </div>
              ))}
              <div className="mt-1 flex items-center justify-between border-t border-dashed pt-3" style={{ borderColor: `${EMERALD}22` }}>
                <span className="text-[12px] font-bold tracking-wide text-[#8a958f] uppercase">Trạng thái</span>
                <span className="rounded-full px-2.5 py-1 text-[11px] font-extrabold text-white" style={{ background: EMERALD }}>ĐÃ XÁC NHẬN ✓</span>
              </div>
            </div>
            {/* tem gold */}
            <div className="absolute top-[46%] right-0 flex h-[74px] w-[74px] items-center justify-center rounded-full text-center font-display text-[10px] leading-tight font-extrabold tracking-wider text-white" style={{ background: GOLD, transform: "rotate(-10deg)", animation: "spinIn .7s both .6s", boxShadow: "0 12px 30px rgba(200,162,74,.45)" }}>
              5★
              <br />
              SERVICE
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENTO GRID ===== */}
      <section id="bang-dich-vu" className="scroll-mt-24 px-5 py-16 sm:px-8 lg:px-13" style={{ background: "#fff" }}>
        <div className="mx-auto max-w-[1320px]">
          <Reveal className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-display text-[13px] font-bold tracking-[3px] uppercase" style={{ color: GOLD }}>Thực đơn dịch vụ</span>
              <h2 className="font-display mt-2 text-[clamp(26px,3.4vw,42px)] leading-[1.08] font-extrabold tracking-[-1.2px]" style={{ color: EMERALD }}>
                Chọn như gọi món —<br />có mặt đúng giờ hẹn
              </h2>
            </div>
            <p className="max-w-[300px] text-[14px] leading-relaxed text-[#8a958f]">Mức giá tham khảo. Gộp chung một hoá đơn với đặt phòng, huỷ miễn phí trước 24h.</p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
            {/* Ô lớn — featured */}
            <Reveal className="relative overflow-hidden rounded-[26px] md:col-span-4 md:row-span-2">
              <div className="relative h-full min-h-[380px]">
                <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop" alt="Đầu bếp riêng" fill sizes="(max-width:768px) 100vw, 800px" className="object-cover transition-transform duration-700 hover:scale-[1.04]" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,30,25,.92) 5%, rgba(10,30,25,.2) 55%, transparent)" }} />
                <span className="absolute top-5 left-5 rounded-full px-3.5 py-1.5 font-display text-[11px] font-extrabold tracking-[2px] text-white uppercase" style={{ background: GOLD }}>Được yêu thích nhất</span>
                <div className="absolute right-6 bottom-6 left-6 text-white">
                  <h3 className="font-display flex items-center gap-2.5 text-[clamp(24px,2.6vw,34px)] font-extrabold tracking-[-.8px]"><Icon name="chef" size={30} strokeWidth={1.6} className="flex-shrink-0 text-[#F4D78C]" /> Đầu bếp riêng</h3>
                  <p className="mt-2 max-w-[440px] text-[14.5px] leading-relaxed text-white/75">Thực đơn thiết kế riêng từ nguyên liệu chợ sớm địa phương. Bạn chọn món — mọi thứ còn lại để bếp trưởng lo, kể cả rửa bát.</p>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="font-display text-[18px] font-extrabold" style={{ color: "#F4D78C" }}>chỉ từ {fmtVnd(500000)}</span>
                    <button onClick={() => flash('"Đầu bếp riêng" sắp ra mắt — cảm ơn bạn! 🙌')} className="rounded-full bg-white px-5 py-2.5 text-[13.5px] font-extrabold transition-transform hover:scale-105" style={{ color: EMERALD }}>
                      Đặt trước →
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* 5 ô nhỏ */}
            {SERVICES.slice(1).map((s, i) => (
              <Reveal key={s.title} delay={i * 70} className="group rounded-[26px] border bg-[#FAF7F0] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_44px_rgba(14,59,51,.12)] md:col-span-2" style={{ borderColor: "#eee7d8" }}>
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_6px_18px_rgba(14,59,51,.08)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ color: EMERALD }}><Icon name={s.icon} size={24} /></span>
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wide uppercase" style={{ background: `${GOLD}1d`, color: "#9a7a2e" }}>từ {fmtVnd(s.from)}</span>
                </div>
                <h3 className="font-display mt-4 text-[17px] font-extrabold tracking-[-.3px]" style={{ color: EMERALD }}>{s.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#7a857f]">{s.desc}</p>
                <button onClick={() => flash(`"${s.title}" sắp ra mắt — cảm ơn bạn! 🙌`)} className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-extrabold transition-all group-hover:gap-2.5" style={{ color: EMERALD }}>
                  Đặt trước
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE — một ngày trọn vẹn ===== */}
      <section className="px-5 py-16 sm:px-8 lg:px-13 lg:py-24">
        <div className="mx-auto max-w-[860px]">
          <Reveal className="mb-12 text-center">
            <span className="font-display text-[13px] font-bold tracking-[3px] uppercase" style={{ color: GOLD }}>Một ngày có concierge</span>
            <h2 className="font-display mt-2 text-[clamp(26px,3.4vw,42px)] font-extrabold tracking-[-1.2px]" style={{ color: EMERALD }}>Từ lúc hạ cánh đến khi say giấc</h2>
          </Reveal>

          <div className="relative mx-auto max-w-[640px]">
            <div className="flex flex-col">
              {TIMELINE.map((t, i) => {
                const last = i === TIMELINE.length - 1;
                return (
                  <Reveal key={t.time} delay={i * 90} className={`group relative flex gap-5 sm:gap-7 ${last ? "" : "pb-8"}`}>
                    {/* cột mốc + đường nối dọc */}
                    <div className="relative flex w-12 flex-shrink-0 justify-center">
                      {!last && (
                        <span className="absolute top-12 bottom-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full" style={{ background: `linear-gradient(${GOLD}, ${GOLD}44)` }} />
                      )}
                      <span className="relative z-[1] flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_rgba(14,59,51,.1)] ring-2 ring-gold/70 transition-transform duration-300 group-hover:scale-110" style={{ color: EMERALD }}>
                        <Icon name={t.icon} size={20} strokeWidth={1.7} />
                      </span>
                    </div>
                    {/* thẻ nội dung */}
                    <div className="flex-1 rounded-[20px] border bg-white p-6 shadow-[0_10px_30px_rgba(14,59,51,.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(14,59,51,.12)]" style={{ borderColor: "#eee7d8" }}>
                      <span className="font-display text-[13px] font-extrabold tracking-[2px]" style={{ color: GOLD }}>{t.time}</span>
                      <h3 className="font-display mt-1.5 text-[18px] font-extrabold tracking-[-.3px]" style={{ color: EMERALD }}>{t.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-[#7a857f]">{t.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA — emerald đậm ===== */}
      <section className="px-5 pb-20 sm:px-8 lg:px-13 lg:pb-28">
        <Reveal className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[32px] px-8 py-14 text-center lg:px-16" style={{ background: `linear-gradient(135deg, ${EMERALD} 0%, #14534a 60%, #0d6b54 100%)` }}>
          <div className="absolute -top-24 right-[15%] h-[300px] w-[300px] rounded-full blur-[60px]" style={{ background: "radial-gradient(circle, rgba(200,162,74,.35), transparent 70%)", animation: "floaty 12s ease-in-out infinite" }} />
          <div className="pointer-events-none absolute inset-0 opacity-[.08]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          <div className="relative">
            <span className="font-display text-[12px] font-bold tracking-[4px] uppercase" style={{ color: "#F4D78C" }}>Sắp ra mắt</span>
            <h2 className="font-display mx-auto mt-3 max-w-[640px] text-[clamp(26px,3.6vw,44px)] leading-[1.1] font-extrabold tracking-[-1.2px] text-white">
              Chuyến đi tới, hãy để chúng tôi <span style={{ color: "#F4D78C" }}>phục vụ</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] text-[15.5px] leading-relaxed text-white/70">Đặt chỗ ở ngay hôm nay — dịch vụ concierge sẽ tự động mở cho đơn của bạn khi ra mắt.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/phong" className="rounded-[14px] px-8 py-4 font-display text-[15px] font-extrabold shadow-[0_16px_40px_rgba(0,0,0,.3)] transition-transform hover:scale-105" style={{ background: "#F4D78C", color: EMERALD }}>
                Tìm chỗ ở ngay
              </Link>
              <button onClick={() => flash("Cảm ơn! Concierge sẽ liên hệ bạn sớm nhất 🤵")} className="rounded-[14px] border border-white/30 px-8 py-4 text-[15px] font-bold text-white transition-colors hover:bg-white/10">
                Đăng ký nhận tin
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
