"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/app/providers";
import RoomCard from "@/components/room-card";
import Reveal from "@/components/reveal";
import CountUp from "@/components/count-up";
import { Icon } from "@/components/icons";
import { locName, pseudoRating } from "@/lib/format";
import type { Phong, ViTri } from "@/lib/types";

const STATS = [
  { target: 1200, suffix: "+", decimals: 0, label: "Chỗ ở độc đáo", color: "#0E5345", bg: "#EEF3F0", border: "#D7E5DF" },
  { target: 8, suffix: "", decimals: 0, label: "Điểm đến nổi bật", color: "#A9852F", bg: "#F7F1E1", border: "#ECDFBE" },
  { target: 4.9, suffix: "", decimals: 1, label: "Điểm đánh giá trung bình", color: "#0E6B5A", bg: "#E9F4F0", border: "#CDE6DE" },
  { target: 50, suffix: "K+", decimals: 0, label: "Khách hài lòng", color: "#2F3A36", bg: "#F0F2EF", border: "#DDE2DD" },
];

const FEATURES = [
  { icon: "bolt", title: "Đặt phòng tức thì", desc: "Tìm và đặt chỗ ở chỉ trong vài phút, xác nhận ngay lập tức.", bg: "#EEF3F0", color: "#0E5345" },
  { icon: "shield", title: "Thanh toán an toàn", desc: "Bảo mật thông tin với nhiều phương thức: thẻ, MoMo, ngân hàng.", bg: "#F7F1E1", color: "#A9852F" },
  { icon: "chat", title: "Hỗ trợ 24/7", desc: "Đội ngũ luôn sẵn sàng đồng hành cùng bạn suốt hành trình.", bg: "#E9F4F0", color: "#0E6B5A" },
  { icon: "tag", title: "Giá tốt mỗi ngày", desc: "Cam kết mức giá minh bạch, không phí ẩn, ưu đãi thường xuyên.", bg: "#F0F2EF", color: "#2F3A36" },
];

const TESTIMONIALS = [
  { quote: "“Đặt phòng siêu nhanh, chỗ ở đúng như hình. Mình đã có một kỳ nghỉ tuyệt vời ở Đà Lạt!”", ten: "Ngọc Hân", loc: "TP. Hồ Chí Minh", initial: "H", bg: "linear-gradient(135deg,#0E5345,#14705A)" },
  { quote: "“Giao diện dễ dùng, nhiều lựa chọn đẹp với giá hợp lý. Hỗ trợ phản hồi rất nhanh khi cần.”", ten: "Minh Khôi", loc: "Hà Nội", initial: "K", bg: "linear-gradient(135deg,#C8A24A,#A9852F)" },
  { quote: "“Villa ở Phú Quốc cho cả nhóm cực đáng tiền. Chắc chắn sẽ tiếp tục đặt qua airbnb.”", ten: "Thanh Tâm", loc: "Đà Nẵng", initial: "T", bg: "linear-gradient(135deg,#1C8A6E,#0E6B5A)" },
];

const MARQUEE = ["Đà Lạt", "Phú Quốc", "Hội An", "Sa Pa", "Nha Trang", "Vũng Tàu", "Đà Nẵng", "Hà Nội"];

const CATEGORIES = [
  { icon: "beach", title: "Bên bờ biển", desc: "Villa sát biển, view hoàng hôn", grad: "linear-gradient(135deg,#1C8A6E,#0E5345)" },
  { icon: "mountain", title: "Giữa núi rừng", desc: "Săn mây, homestay giữa thiên nhiên", grad: "linear-gradient(135deg,#2FA98A,#13705A)" },
  { icon: "city", title: "Trong trung tâm", desc: "Căn hộ giữa lòng thành phố", grad: "linear-gradient(135deg,#0E6B5A,#0A3F35)" },
  { icon: "pool", title: "Có hồ bơi", desc: "Nghỉ dưỡng với hồ bơi riêng", grad: "linear-gradient(135deg,#3F8E76,#1C6B5A)" },
  { icon: "sunrise", title: "View tuyệt đẹp", desc: "Ngắm cảnh ngay từ phòng nghỉ", grad: "linear-gradient(135deg,#D8B45E,#C8A24A)" },
  { icon: "gem", title: "Sang trọng", desc: "Penthouse & biệt thự cao cấp", grad: "linear-gradient(135deg,#C8A24A,#9A7B2E)" },
];

const STEPS = [
  { no: "01", icon: "search", title: "Tìm kiếm", desc: "Chọn điểm đến, ngày đi và số khách. Lọc theo ngân sách và phong cách bạn thích." },
  { no: "02", icon: "calendar", title: "Đặt phòng", desc: "Xem ảnh thật, đánh giá thật rồi đặt chỗ chỉ với vài cú nhấp — xác nhận tức thì." },
  { no: "03", icon: "luggage", title: "Tận hưởng", desc: "Nhận thông tin nhận phòng, xách vali lên đường. Hỗ trợ 24/7 suốt hành trình." },
];

const FAQS = [
  { q: "Đặt phòng trên airbnb có an toàn không?", a: "Mọi giao dịch đều được mã hoá và thanh toán qua cổng bảo mật. Tiền chỉ được chuyển cho chủ nhà sau khi bạn nhận phòng thành công." },
  { q: "Tôi có thể huỷ đặt phòng không?", a: "Có. Mỗi chỗ ở có chính sách huỷ riêng được ghi rõ trước khi đặt. Phần lớn cho phép huỷ miễn phí trong vòng 48 giờ sau khi đặt." },
  { q: "Có những phương thức thanh toán nào?", a: "Chúng tôi hỗ trợ thẻ tín dụng/ghi nợ, ví MoMo và chuyển khoản ngân hàng nội địa — tất cả đều an toàn và xác nhận tức thì." },
  { q: "Làm sao để trở thành chủ nhà?", a: "Đăng chỗ ở hoàn toàn miễn phí. Chỉ cần vài bước đăng tin với hình ảnh và mô tả, bạn đã có thể bắt đầu đón khách và kiếm thêm thu nhập." },
];

export default function HomeClient({
  viTriList,
  phongList,
}: {
  viTriList: ViTri[];
  phongList: Phong[];
}) {
  const { flash } = useApp();
  const router = useRouter();
  const [selectedLoc, setSelectedLoc] = useState<number | null>(null);
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");

  const featured = [...phongList]
    .sort((a, b) => pseudoRating(b.id) - pseudoRating(a.id))
    .slice(0, 4);

  const doSearch = () => {
    router.push(selectedLoc ? `/phong?viTri=${selectedLoc}` : "/phong");
  };

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    flash("Cảm ơn bạn đã đăng ký nhận tin! 💌");
    setEmail("");
  };

  return (
    <div style={{ animation: "fadeIn .4s both" }}>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24 lg:px-13 lg:py-30" style={{ background: "linear-gradient(135deg,#0A2A24 0%,#0E3B33 50%,#06201B 100%)", backgroundSize: "180% 180%", animation: "gradientShift 12s ease infinite" }}>
        <div className="absolute -top-30 -right-15 h-[420px] w-[420px] rounded-full blur-[10px]" style={{ background: "radial-gradient(circle, rgba(255,255,255,.4), transparent 70%)", animation: "floaty 11s ease-in-out infinite" }} />
        <div className="absolute -bottom-40 -left-20 h-[460px] w-[460px] rounded-full blur-[14px]" style={{ background: "radial-gradient(circle, rgba(200,162,74,.45), transparent 70%)", animation: "floaty2 13s ease-in-out infinite" }} />
        <div className="absolute top-10 left-[28%] h-[220px] w-[220px] rounded-full blur-[8px]" style={{ background: "radial-gradient(circle, rgba(255,255,255,.28), transparent 70%)", animation: "floaty 9s ease-in-out .5s infinite" }} />
        <div className="absolute top-[40%] right-[18%] hidden h-[160px] w-[160px] rounded-full blur-[6px] md:block" style={{ background: "radial-gradient(circle, rgba(255,209,92,.45), transparent 70%)", animation: "floaty3 10s ease-in-out 1s infinite" }} />

        <div className="relative mx-auto max-w-[1040px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-[13.5px] font-semibold text-white backdrop-blur-[8px]" style={{ animation: "badgePop .6s both" }}>
            <span className="h-2 w-2 rounded-full bg-white" style={{ animation: "pulseDot 2s ease-in-out infinite" }} />
            Hơn 1.200 chỗ ở độc đáo trên khắp Việt Nam
          </div>
          <h1 className="font-display mt-5.5 text-[clamp(40px,6.4vw,76px)] leading-[1.02] font-extrabold tracking-[-2px] text-white" style={{ textShadow: "0 8px 40px rgba(0,0,0,.18)", animation: "fadeUp .6s both .08s" }}>
            Đặt phòng.
            <br />
            <span
              style={{
                background: "linear-gradient(90deg,#fff 20%,#FFD15C 40%,#fff 60%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                animation: "shimmer 4s linear infinite",
              }}
            >
              Bắt đầu chuyến đi.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-[clamp(16px,1.6vw,20px)] font-medium text-white/90" style={{ animation: "fadeUp .6s both .16s" }}>
            Từ homestay săn mây Đà Lạt đến villa bãi biển Phú Quốc — tìm nơi nghỉ
            hoàn hảo cho mọi hành trình.
          </p>

          {/* SEARCH BAR */}
          <div className="mx-auto mt-10 flex max-w-[940px] flex-col items-stretch gap-1 rounded-3xl bg-white p-2.5 shadow-[0_30px_70px_rgba(0,0,0,.28)] md:flex-row" style={{ animation: "scaleIn .55s both .24s" }}>
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
            <button onClick={doSearch} className="m-1.5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand to-brand-pink px-6.5 py-3.5 font-bold text-white shadow-[0_10px_24px_rgba(14,59,51,.45)] transition-transform hover:-translate-y-px">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></svg>
              Tìm kiếm
            </button>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="mt-2 overflow-hidden border-y border-[#f0f0f3] bg-cream py-4">
        <div className="flex w-max items-center gap-11" style={{ animation: "marquee 32s linear infinite" }}>
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="font-display flex items-center gap-11 text-[19px] font-extrabold whitespace-nowrap text-[#d6d6dc]">
              {m}
              <span className="text-brand">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="mx-auto max-w-[1320px] px-5 pt-10 sm:px-8 lg:px-13 lg:pt-15">
        <div className="grid grid-cols-2 gap-5.5 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="rounded-[20px] border p-6 transition-transform duration-300 hover:-translate-y-[5px] hover:shadow-[0_18px_40px_rgba(0,0,0,.08)]" style={{ background: s.bg, borderColor: s.border }}>
              <div className="font-display text-[34px] leading-none font-extrabold tracking-[-1px]" style={{ color: s.color }}>
                <CountUp target={s.target} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <div className="mt-2.5 text-[14.5px] font-semibold text-ink-soft">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="mx-auto max-w-[1320px] px-5 pt-12 sm:px-8 lg:px-13 lg:pt-16">
        <Reveal className="mb-6.5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff7e6] px-3 py-1.5 text-[12.5px] font-bold whitespace-nowrap text-[#c97a00]">★ Được yêu thích nhất</div>
            <h2 className="font-display mt-3.5 text-[clamp(26px,3.2vw,38px)] font-extrabold tracking-[-1px]">Chỗ ở nổi bật</h2>
            <p className="mt-2 text-base text-muted">Những nơi nghỉ được khách đánh giá cao nhất</p>
          </div>
          <Link href="/phong" className="group hidden items-center gap-2 rounded-full border-[1.5px] border-line-2 bg-white px-5 py-3 text-[14.5px] font-bold transition-colors hover:border-brand hover:text-brand sm:inline-flex">
            Xem tất cả chỗ ở
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </Reveal>
        <div className="grid grid-cols-1 gap-x-6.5 gap-y-7.5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((room, i) => (
            <RoomCard key={room.id} room={room} viTriList={viTriList} index={i} />
          ))}
        </div>
        <div className="mt-9 flex justify-center sm:hidden">
          <Link href="/phong" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-brand to-brand-pink px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(14,59,51,.4)]">
            Xem tất cả chỗ ở →
          </Link>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="mx-auto max-w-[1320px] px-5 pt-16 pb-16 sm:px-8 lg:px-13">
        <Reveal className="mb-6.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eef3f0] px-3 py-1.5 text-[12.5px] font-bold whitespace-nowrap text-brand">✦ Cảm hứng du lịch</div>
          <h2 className="font-display mt-3.5 text-[clamp(26px,3.2vw,38px)] font-extrabold tracking-[-1px]">Điểm đến được yêu thích</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {viTriList.map((v, i) => {
            const count = phongList.filter((r) => r.viTri === v.id).length;
            return (
              <Reveal key={v.id} delay={(i % 4) * 80}>
                <button
                  onClick={() => {
                    flash(`Đang xem chỗ ở tại ${v.tenViTri}`);
                    router.push(`/phong?viTri=${v.id}`);
                  }}
                  className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[20px] text-left shadow-[0_10px_30px_rgba(0,0,0,.12)] transition-transform duration-300 hover:-translate-y-[7px]"
                >
                  {v.hinhAnh && (
                    <Image src={v.hinhAnh} alt={v.tenViTri} fill sizes="(max-width:768px) 50vw, 216px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,.05) 55%)" }} />
                  <div className="absolute inset-x-4.5 bottom-4">
                    <div className="font-display text-[21px] font-extrabold tracking-tight text-white">{v.tenViTri}</div>
                    <div className="mt-1 text-[13.5px] font-semibold text-white/85">{count} chỗ ở</div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-13">
        <Reveal className="mb-6.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eef3f0] px-3 py-1.5 text-[12.5px] font-bold whitespace-nowrap text-brand">◆ Hợp gu của bạn</div>
          <h2 className="font-display mt-3.5 text-[clamp(26px,3.2vw,38px)] font-extrabold tracking-[-1px]">Khám phá theo phong cách</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.title} delay={(i % 6) * 70} className="h-full">
              <button
                onClick={() => router.push("/phong")}
                className="group relative flex h-full w-full flex-col items-center gap-3.5 overflow-hidden rounded-[22px] border border-line-2 bg-white px-3 py-7 text-center shadow-[0_6px_20px_rgba(14,59,51,.05)] transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_22px_46px_rgba(14,59,51,.14)]"
              >
                {/* viền vàng mảnh phía trên mở rộng khi hover */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                {/* quầng sáng vàng mờ phía sau icon khi hover */}
                <span className="pointer-events-none absolute top-3 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(200,162,74,.4), transparent 70%)" }} />

                {/* icon */}
                <span className="relative flex h-[60px] w-[60px] items-center justify-center rounded-2xl transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6">
                  {/* nền tròn: tonal nhạt -> gradient đậm khi hover */}
                  <span className="absolute inset-0 rounded-2xl bg-[#eef3f0] transition-opacity duration-500 group-hover:opacity-0" />
                  <span className="absolute inset-0 rounded-2xl opacity-0 shadow-[0_12px_24px_rgba(14,59,51,.25)] transition-opacity duration-500 group-hover:opacity-100" style={{ background: c.grad }} />
                  <Icon name={c.icon} size={27} className="relative text-brand transition-colors duration-500 group-hover:text-white" />
                </span>

                <span className="relative">
                  <span className="font-display text-[15.5px] font-bold tracking-tight transition-colors duration-300 group-hover:text-brand">{c.title}</span>
                  {/* gạch chân vàng mở rộng */}
                  <span className="mx-auto mt-1.5 block h-[2px] w-0 rounded-full bg-gold transition-all duration-500 ease-out group-hover:w-8" />
                </span>
                <span className="text-[12.5px] leading-snug text-muted-2">{c.desc}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-5 py-16 sm:px-8 lg:px-13" style={{ background: "linear-gradient(180deg,#fffdf9,#F3F6F4)" }}>
        <div className="mx-auto max-w-[1320px]">
          <Reveal className="mx-auto mb-12 max-w-[620px] text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f4f0] px-3 py-1.5 text-[12.5px] font-bold whitespace-nowrap text-brand">✦ Đơn giản &amp; nhanh chóng</div>
            <h2 className="font-display mt-3.5 text-[clamp(26px,3.2vw,38px)] font-extrabold tracking-[-1px]">Đặt phòng chỉ với 3 bước</h2>
            <p className="mt-3 text-[16.5px] leading-relaxed text-muted">Từ tìm kiếm đến xách vali lên đường — mọi thứ gọn gàng trong vài phút.</p>
          </Reveal>
          <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
            {/* đường nối nét đứt giữa các bước (chỉ hiện trên màn lớn) */}
            <div className="pointer-events-none absolute top-[44px] right-[16%] left-[16%] hidden border-t-2 border-dashed border-[#cfe0d8] sm:block" />
            {STEPS.map((s, i) => (
              <Reveal key={s.no} delay={i * 110} className="relative text-center">
                <div className="relative mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-[26px] bg-white text-brand shadow-[0_12px_30px_rgba(14,59,51,.16)] ring-1 ring-[#D7E5DF] transition-transform duration-500 group-hover:scale-105">
                  <Icon name={s.icon} size={34} strokeWidth={1.6} />
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-pink font-display text-[12px] font-extrabold text-white shadow-[0_4px_12px_rgba(14,59,51,.45)]">
                    {s.no}
                  </span>
                </div>
                <h3 className="font-display mt-5 text-[19px] font-bold tracking-[-.3px]">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-[300px] text-[14.5px] leading-relaxed text-muted">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 py-16 sm:px-8 lg:px-13" style={{ background: "linear-gradient(180deg,#F3F6F4,#fffdf9)" }}>
        <div className="mx-auto max-w-[1320px]">
          <Reveal className="mx-auto mb-11 max-w-[620px] text-center">
            <h2 className="font-display text-[clamp(26px,3.2vw,38px)] font-extrabold tracking-[-1px]">Vì sao chọn airbnb?</h2>
            <p className="mt-3 text-[16.5px] leading-relaxed text-muted">Mọi thứ bạn cần cho một chuyến đi trọn vẹn — đơn giản, an toàn và đáng tin cậy.</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 90} className="h-full">
                <div className="group h-full rounded-[22px] border border-line bg-white p-7 shadow-[0_8px_26px_rgba(14,59,51,.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[0_18px_42px_rgba(14,59,51,.12)]">
                  <div className="mb-4.5 flex h-[54px] w-[54px] items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" style={{ background: f.bg, color: f.color }}>
                    <Icon name={f.icon} size={26} />
                  </div>
                  <h3 className="font-display text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-13">
        <Reveal className="mx-auto mb-11 max-w-[600px] text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff7e6] px-3 py-1.5 text-[12.5px] font-bold whitespace-nowrap text-[#c97a00]">★ 4.9 / 5 từ 50.000+ đánh giá</div>
          <h2 className="font-display mt-3.5 text-[clamp(26px,3.2vw,38px)] font-extrabold tracking-[-1px]">Khách hàng nói gì về chúng tôi</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.ten} delay={i * 110} className="rounded-[22px] border border-[#f0f0f3] bg-white p-7.5 shadow-[0_8px_26px_rgba(0,0,0,.05)] transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_42px_rgba(0,0,0,.1)]">
              <div className="text-[17px] tracking-[3px] text-gold">★★★★★</div>
              <p className="my-4 text-base leading-[1.72] font-medium text-ink-soft">{t.quote}</p>
              <div className="flex items-center gap-3.5 border-t border-line pt-4.5">
                <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full font-display text-[17px] font-bold text-white" style={{ background: t.bg }}>{t.initial}</div>
                <div>
                  <div className="text-[15px] font-bold whitespace-nowrap">{t.ten}</div>
                  <div className="mt-0.5 text-[13.5px] text-muted-2">{t.loc}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 lg:px-13">
        <Reveal className="mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f1e1] px-3 py-1.5 text-[12.5px] font-bold whitespace-nowrap text-[#A9852F]">? Giải đáp thắc mắc</div>
          <h2 className="font-display mt-3.5 text-[clamp(26px,3.2vw,38px)] font-extrabold tracking-[-1px]">Câu hỏi thường gặp</h2>
        </Reveal>
        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <Reveal key={f.q} delay={i * 70}>
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className={`w-full rounded-[18px] border bg-white px-6 py-5 text-left transition-all ${open ? "border-brand shadow-[0_10px_30px_rgba(14,59,51,.1)]" : "border-line-2 hover:border-[#e0e0e6]"}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-[16.5px] font-bold tracking-tight">{f.q}</span>
                    <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[20px] leading-none font-light transition-transform duration-300 ${open ? "rotate-45 bg-brand text-white" : "bg-cream text-ink"}`}>
                      +
                    </span>
                  </div>
                  <div className={`grid transition-all duration-300 ${open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <p className="overflow-hidden text-[14.5px] leading-relaxed text-muted">{f.a}</p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-5 pb-16 sm:px-8 lg:px-13">
        <Reveal className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[30px] border border-[#D7E5DF] px-8 py-12 text-center lg:px-16" style={{ background: "linear-gradient(135deg,#EEF3F0,#F7F1E1)" }}>
          <div className="absolute -top-16 -right-10 h-[240px] w-[240px] rounded-full blur-[20px]" style={{ background: "radial-gradient(circle, rgba(200,162,74,.18), transparent 70%)" }} />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-bold whitespace-nowrap text-brand shadow-[0_4px_12px_rgba(0,0,0,.05)]"><Icon name="mail" size={15} strokeWidth={2} /> Bản tin mỗi tuần</div>
            <h2 className="font-display mt-4 text-[clamp(24px,3vw,36px)] font-extrabold tracking-[-1px]">Nhận ưu đãi sớm nhất</h2>
            <p className="mx-auto mt-3 max-w-[460px] text-[15.5px] leading-relaxed text-muted">Gợi ý điểm đến mới và mã giảm giá độc quyền, gửi thẳng đến hộp thư của bạn.</p>
            <form onSubmit={onSubscribe} className="mx-auto mt-7 flex max-w-[480px] flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email của bạn"
                className="flex-1 rounded-2xl border border-line-2 bg-white px-5 py-3.5 text-[15px] font-medium outline-none transition-colors focus:border-brand"
              />
              <button type="submit" className="flex-shrink-0 rounded-2xl bg-gradient-to-br from-brand to-brand-pink px-7 py-3.5 font-bold text-white shadow-[0_10px_24px_rgba(14,59,51,.4)] transition-transform hover:-translate-y-px">
                Đăng ký
              </button>
            </form>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <Reveal className="px-5 pb-20 sm:px-8 lg:px-13">
        <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[30px] px-8 py-12 lg:px-16" style={{ background: "linear-gradient(125deg,#0A2A24 0%,#0E3B33 50%,#06201B 100%)", backgroundSize: "180% 180%", animation: "gradientShift 9s ease infinite" }}>
          <div className="absolute -top-22 -right-10 h-[340px] w-[340px] rounded-full blur-[8px]" style={{ background: "radial-gradient(circle, rgba(255,255,255,.32), transparent 70%)", animation: "floaty 12s ease-in-out infinite" }} />
          <div className="absolute -bottom-30 left-[20%] h-[300px] w-[300px] rounded-full blur-[12px]" style={{ background: "radial-gradient(circle, rgba(200,162,74,.4), transparent 70%)", animation: "floaty2 14s ease-in-out infinite" }} />
          <div className="relative flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-[640px]">
              <h2 className="font-display text-[clamp(28px,3.6vw,44px)] leading-[1.08] font-extrabold tracking-[-1.2px] text-white" style={{ textShadow: "0 6px 30px rgba(0,0,0,.15)" }}>
                Cho thuê chỗ ở của bạn,
                <br />
                kiếm thêm thu nhập
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-white/90">Đăng chỗ ở miễn phí, tiếp cận hàng nghìn du khách và bắt đầu đón khách chỉ sau vài bước đơn giản.</p>
            </div>
            <button onClick={() => flash("Tính năng cho thuê chỗ ở sắp ra mắt! 🏡")} className="font-display flex-shrink-0 rounded-[15px] bg-white px-8.5 py-4.5 text-[16.5px] font-extrabold text-brand shadow-[0_16px_36px_rgba(0,0,0,.22)] transition-transform hover:scale-105" style={{ animation: "bobble 3.5s ease-in-out infinite" }}>
              Bắt đầu cho thuê →
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
