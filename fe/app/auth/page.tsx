"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useApp } from "@/app/providers";
import { login, register } from "@/lib/api";

const GOLD = "#E9C878";

/* ---------- Icons dùng chung ---------- */
const ICONS = {
  mail: <><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m3 6 9 7 9-7" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
};
type IconName = keyof typeof ICONS;

function Icon({ name, stroke }: { name: IconName; stroke: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute top-1/2 left-4 -translate-y-1/2">
      {ICONS[name]}
    </svg>
  );
}

/* ---------- Input tối (form đăng nhập) ---------- */
function DarkField({
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  icon: IconName;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Icon name={icon} stroke="rgba(233,200,120,.75)" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[14px] border border-white/15 bg-white/[.07] py-3.5 pr-4 pl-11.5 text-[15px] text-white outline-none transition-all placeholder:text-white/40 autofill:[-webkit-text-fill-color:#fff] autofill:[box-shadow:inset_0_0_0_1000px_#231c29] focus:border-[#E9C878]/70 focus:bg-white/[.12] focus:shadow-[0_0_0_4px_rgba(233,200,120,.12)]"
      />
    </div>
  );
}

/* ---------- Input sáng (form đăng ký) ---------- */
function LightField({
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  icon: IconName;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Icon name={icon} stroke="#B0B0BA" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[14px] border-[1.5px] border-line-2 bg-white py-3.5 pr-4 pl-11.5 text-[15px] text-ink outline-none transition-all placeholder:text-muted-2 autofill:[-webkit-text-fill-color:#1A1A1F] autofill:[box-shadow:inset_0_0_0_1000px_#fff] focus:border-brand focus:shadow-[0_0_0_4px_rgba(14,59,51,.12)]"
      />
    </div>
  );
}

/* ---------- Độ mạnh mật khẩu (form đăng ký) ---------- */
function passStrength(pass: string) {
  if (!pass) return { level: -1, label: "", color: "#E4E4E8" };
  let s = 0;
  if (pass.length >= 6) s++;
  if (/[A-Z]/.test(pass) || /[^a-zA-Z0-9]/.test(pass)) s++;
  if (pass.length >= 10 && /[0-9]/.test(pass)) s++;
  const labels = ["Yếu", "Trung bình", "Mạnh", "Rất mạnh"];
  const colors = ["#E4685F", "#F59E0B", "#FF8A4D", "#0E8C7C"];
  return { level: s, label: labels[s], color: colors[s] };
}

function AuthInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const modeParam = params.get("mode");
  const { setUser, flash } = useApp();

  const [mode, setMode] = useState<"login" | "register">(
    modeParam === "register" ? "register" : "login",
  );

  // Đồng bộ chế độ khi URL ?mode= đổi (vd bấm nút trên header lúc đang ở /auth)
  useEffect(() => {
    setMode(modeParam === "register" ? "register" : "login");
  }, [modeParam]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;
    if (mode === "register" && !agree) {
      flash("Vui lòng đồng ý với điều khoản dịch vụ");
      return;
    }
    setLoading(true);
    try {
      // Cả register và login đều set cookie httpOnly + trả về user
      const { user } =
        mode === "register"
          ? await register({ name, email, password: pass, phone })
          : await login(email, pass);
      setUser(user);
      flash(
        mode === "register"
          ? `Tạo tài khoản thành công, ${user.name}! 🎉`
          : "Chào mừng trở lại! 👋",
      );
      router.push(redirect);
    } catch (e) {
      flash(e instanceof Error ? e.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const switchTo = (m: "login" | "register") => {
    setMode(m);
    setPass("");
  };

  /* ============================================================
     ĐĂNG NHẬP — Midnight luxury: ảnh tối toàn màn + thẻ kính + gold
     ============================================================ */
  if (mode === "login") {
    return (
      <div className="relative -mt-19 min-h-screen overflow-hidden" style={{ animation: "fadeIn .5s both" }}>
        {/* Nền ảnh + phủ tối */}
        <Image
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=80&auto=format&fit=crop"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(6,5,10,.93) 0%, rgba(8,6,12,.78) 45%, rgba(10,8,14,.55) 100%)" }} />
        {/* hạt film + glow gold */}
        <div className="pointer-events-none absolute inset-0 opacity-[.05]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -top-30 right-[20%] h-[380px] w-[380px] rounded-full blur-[70px]" style={{ background: "radial-gradient(circle, rgba(233,200,120,.18), transparent 70%)", animation: "floaty 14s ease-in-out infinite" }} />

        <div className="relative mx-auto flex min-h-screen max-w-[1280px] flex-col items-center justify-center gap-16 px-5 pt-28 pb-16 sm:px-8 lg:flex-row lg:justify-between lg:px-13">
          {/* Trái — typography sang trọng */}
          <div className="hidden max-w-[520px] flex-1 lg:block" style={{ animation: "fadeUp .7s both .1s" }}>
            <div className="flex items-center gap-4">
              <span className="h-px w-12" style={{ background: GOLD }} />
              <span className="font-display text-[12px] font-bold tracking-[5px] uppercase" style={{ color: GOLD }}>
                Thành viên airbnb
              </span>
            </div>
            <h1 className="font-display mt-7 text-[clamp(40px,4.6vw,64px)] leading-[1.04] font-extrabold tracking-[-1.8px] text-white">
              Nơi mọi
              <br />
              hành trình
              <br />
              <span
                style={{
                  background: `linear-gradient(90deg, #fff 15%, ${GOLD} 50%, #fff 85%)`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  animation: "shimmer 5s linear infinite",
                }}
              >
                bắt đầu lại.
              </span>
            </h1>
            <p className="mt-6 max-w-[400px] text-[16px] leading-relaxed text-white/55">
              Hơn 1.200 chỗ ở tuyển chọn đang chờ bạn quay lại — cùng những ưu đãi
              chỉ dành riêng cho thành viên.
            </p>
            <div className="mt-10 flex items-center gap-5">
              <div className="text-[15px] tracking-[3px]" style={{ color: GOLD }}>★★★★★</div>
              <p className="text-[13.5px] text-white/45">4.9/5 từ 50.000+ đánh giá</p>
            </div>
            <p className="mt-12 border-l-2 pl-5 text-[15px] leading-relaxed text-white/40 italic" style={{ borderColor: `${GOLD}55` }}>
              “Mỗi chuyến đi là một câu chuyện —<br />và câu chuyện hay nhất luôn là chuyến tiếp theo.”
            </p>
          </div>

          {/* Phải — thẻ kính đăng nhập */}
          <div
            className="w-full max-w-[440px] rounded-[26px] border border-white/12 p-8 backdrop-blur-[28px] sm:p-10"
            style={{
              background: "linear-gradient(165deg, rgba(28,22,32,.72), rgba(10,8,14,.82))",
              boxShadow: `0 40px 90px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.14), 0 0 60px rgba(233,200,120,.08)`,
              animation: "scaleIn .55s both .15s",
            }}
          >
            {/* huy hiệu */}
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-white/15 bg-white/[.08]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 11.4 12 4l9 7.4V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill={GOLD} /></svg>
              </span>
              <span className="font-display text-[11px] font-bold tracking-[4px] uppercase" style={{ color: `${GOLD}99` }}>
                Private access
              </span>
            </div>

            <h2 className="font-display mt-7 text-[30px] font-extrabold tracking-[-.8px] text-white">Đăng nhập</h2>
            <p className="mt-1.5 text-[14px] text-white/50">Chào mừng trở lại. Hành trình đang chờ bạn.</p>

            <div className="mt-7 flex flex-col gap-3.5">
              <DarkField icon="mail" type="email" value={email} onChange={setEmail} placeholder="Email của bạn" />
              <DarkField icon="lock" type="password" value={pass} onChange={setPass} placeholder="Mật khẩu" />
            </div>

            <div className="mt-4 mb-6 flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-white/55">
                <input type="checkbox" className="h-4 w-4 cursor-pointer accent-[#E9C878]" /> Ghi nhớ tôi
              </label>
              <button className="text-[13px] font-semibold underline-offset-[3px] hover:underline" style={{ color: GOLD }}>
                Quên mật khẩu?
              </button>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="font-display flex w-full items-center justify-center gap-2.5 rounded-[15px] py-4 text-[15.5px] font-extrabold tracking-[.3px] text-[#1a1408] uppercase transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(233,200,120,.4)] disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, #F6E3AC 0%, ${GOLD} 45%, #C9A24E 100%)`, boxShadow: "0 14px 34px rgba(233,200,120,.3)" }}
            >
              {loading ? "Đang xử lý…" : "Đăng nhập"}
              {!loading && (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1a1408" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              )}
            </button>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/12" />
              <span className="text-[12px] text-white/35">hoặc tiếp tục với</span>
              <span className="h-px flex-1 bg-white/12" />
            </div>

            <div className="flex gap-3">
              {["Google", "Facebook"].map((p) => (
                <button key={p} className="flex flex-1 items-center justify-center gap-2 rounded-[13px] border border-white/15 bg-white/[.06] py-3 text-[13.5px] font-bold text-white/85 transition-colors hover:bg-white/[.14]">
                  <span className="font-display text-[15px] font-extrabold">{p[0]}</span> {p}
                </button>
              ))}
            </div>

            <p className="mt-7 text-center text-[14px] text-white/55">
              Chưa có tài khoản?{" "}
              <button onClick={() => switchTo("register")} className="font-extrabold underline underline-offset-[3px]" style={{ color: GOLD }}>
                Đăng ký ngay
              </button>
            </p>

            <p className="mt-5 rounded-xl border border-white/10 bg-white/[.05] px-3 py-2.5 text-center text-[12px] text-white/45">
              Demo: <b className="text-white/80">minhanh@gmail.com</b> · mật khẩu <b className="text-white/80">123456</b>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     ĐĂNG KÝ — Sáng tươi mới: card trắng tách đôi + benefit cards
     ============================================================ */
  const strength = passStrength(pass);

  return (
    <div className="relative overflow-hidden bg-[#FAF8F5] px-5 py-12 sm:px-8 lg:px-13 lg:py-16" style={{ animation: "fadeIn .5s both" }}>
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(rgba(14,59,51,.10) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

      <div className="relative mx-auto grid max-w-[1060px] overflow-hidden rounded-[30px] bg-white shadow-[0_36px_90px_rgba(17,17,20,.16)] lg:grid-cols-[1.05fr_1fr]">
        {/* Trái — thiệp luxury: nền ink đậm + viền chỉ vàng + ảnh đóng khung */}
        <div className="relative hidden overflow-hidden lg:block" style={{ background: "linear-gradient(165deg, #17131C 0%, #211826 55%, #1A1412 100%)" }}>
          {/* viền chỉ vàng kiểu thiệp khách sạn */}
          <div className="pointer-events-none absolute inset-4 rounded-[22px] border" style={{ borderColor: `${GOLD}33` }} />
          {/* grain + glow */}
          <div className="pointer-events-none absolute inset-0 opacity-[.05]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="absolute -top-24 -left-20 h-[300px] w-[300px] rounded-full blur-[70px]" style={{ background: "radial-gradient(circle, rgba(14,59,51,.22), transparent 70%)", animation: "floaty 14s ease-in-out infinite" }} />
          <div className="absolute -right-24 bottom-10 h-[260px] w-[260px] rounded-full blur-[70px]" style={{ background: `radial-gradient(circle, ${GOLD}26, transparent 70%)`, animation: "floaty2 16s ease-in-out infinite" }} />

          <div className="relative flex h-full flex-col p-11">
            {/* đầu: logo + pill vàng */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white/[.06]" style={{ borderColor: `${GOLD}44` }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 11.4 12 4l9 7.4V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill={GOLD} /></svg>
                </span>
                <span className="font-display text-[20px] font-extrabold text-white">airbnb</span>
              </div>
              <span className="rounded-full border px-3.5 py-1.5 text-[10.5px] font-bold tracking-[2.5px] uppercase" style={{ borderColor: `${GOLD}55`, color: GOLD }}>
                Miễn phí trọn đời
              </span>
            </div>

            {/* giữa: ảnh đóng khung như bưu thiếp */}
            <div className="flex flex-1 items-center justify-center py-8">
              <div className="relative" style={{ transform: "rotate(-2.5deg)", animation: "bobble 7s ease-in-out infinite" }}>
                <div className="relative h-[240px] w-[300px] overflow-hidden rounded-[18px] border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,.55)]">
                  <Image
                    src="https://images.unsplash.com/photo-1502933691298-84fc14542831?w=700&q=80&auto=format&fit=crop"
                    alt="Hoàng hôn Phú Quốc"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,8,12,.55), transparent 45%)" }} />
                  <div className="absolute bottom-3 left-4">
                    <p className="font-display text-[13px] font-extrabold text-white">Phú Quốc · Hoàng hôn</p>
                    <p className="text-[11px] text-white/65">Chuyến đi đầu tiên đang chờ bạn</p>
                  </div>
                </div>
                {/* tem gold đè góc */}
                <div className="absolute -top-5 -right-5 flex h-[68px] w-[68px] items-center justify-center rounded-full text-center font-display text-[9px] leading-tight font-extrabold tracking-[1.5px] text-[#1a1408] uppercase" style={{ background: `linear-gradient(135deg, #F6E3AC, ${GOLD})`, transform: "rotate(10deg)", animation: "spinIn .7s both .5s", boxShadow: `0 14px 34px ${GOLD}55` }}>
                  Thành
                  <br />
                  viên mới
                </div>
              </div>
            </div>

            {/* cuối: kicker + headline + stats */}
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10" style={{ background: GOLD }} />
                <span className="font-display text-[10.5px] font-bold tracking-[4px] uppercase" style={{ color: GOLD }}>
                  Một tài khoản — mọi hành trình
                </span>
              </div>
              <h2 className="font-display mt-3.5 text-[clamp(28px,2.9vw,38px)] leading-[1.08] font-extrabold tracking-[-1.2px] text-white">
                Cả thế giới chỗ ở,
                <br />
                <span
                  style={{
                    background: `linear-gradient(90deg, #fff 15%, ${GOLD} 50%, #fff 85%)`,
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    animation: "shimmer 5s linear infinite",
                  }}
                >
                  trong túi bạn.
                </span>
              </h2>

              <div className="mt-5 flex items-center gap-5 text-[13px] font-medium text-white/55">
                <span><b className="font-display text-[16px] text-white">1.200+</b> chỗ ở</span>
                <span className="h-1 w-1 rounded-full" style={{ background: `${GOLD}88` }} />
                <span><b className="font-display text-[16px] text-white">8</b> điểm đến</span>
                <span className="h-1 w-1 rounded-full" style={{ background: `${GOLD}88` }} />
                <span><b className="font-display text-[16px] text-white">4.9</b> <span style={{ color: GOLD }}>★</span></span>
              </div>

              <div className="mt-6 flex items-center gap-3.5 border-t border-white/10 pt-5">
                <div className="flex">
                  {[
                    ["H", "linear-gradient(135deg,#E3C77E,#C8A24A)"],
                    ["K", "linear-gradient(135deg,#1C8A6E,#0E5345)"],
                    ["T", "linear-gradient(135deg,#2FA98A,#0E6B5A)"],
                  ].map(([ch, bg], i) => (
                    <span key={ch} className="flex h-8.5 w-8.5 items-center justify-center rounded-full border-2 border-[#211826] font-display text-[11.5px] font-extrabold text-white" style={{ background: bg, marginLeft: i ? -9 : 0 }}>
                      {ch}
                    </span>
                  ))}
                </div>
                <span className="text-[12.5px] leading-snug font-medium text-white/50">
                  <b className="text-white/90">50.000+</b> thành viên đã bắt đầu tại đây
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Phải — form trắng */}
        <div className="flex flex-col justify-center p-8 sm:p-11">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#eef3f0] px-3 py-1.5 text-[12px] font-bold whitespace-nowrap text-brand">
            ✦ Miễn phí · chưa đến 1 phút
          </div>
          <h1 className="font-display mt-3.5 text-[28px] font-extrabold tracking-[-.6px]">Tạo tài khoản</h1>
          <p className="mt-1.5 mb-6 text-[14.5px] text-muted">Điền thông tin để bắt đầu hành trình.</p>

          <div className="flex flex-col gap-3.5">
            <LightField icon="user" value={name} onChange={setName} placeholder="Họ và tên" />
            <LightField icon="mail" type="email" value={email} onChange={setEmail} placeholder="Email" />
            <LightField icon="phone" value={phone} onChange={setPhone} placeholder="Số điện thoại" />
            <LightField icon="lock" type="password" value={pass} onChange={setPass} placeholder="Tạo mật khẩu" />

            {/* Thanh đo độ mạnh mật khẩu */}
            <div className="flex items-center gap-2.5">
              <div className="flex flex-1 gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-[5px] flex-1 rounded-full transition-colors duration-300" style={{ background: strength.level >= i ? strength.color : "#EFEFF2" }} />
                ))}
              </div>
              <span className="min-w-16 text-right text-[12px] font-bold" style={{ color: strength.level >= 0 ? strength.color : "#E4E4E8" }}>
                {strength.label}
              </span>
            </div>
          </div>

          <label className="my-5 flex cursor-pointer items-start gap-2.5">
            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} className="mt-0.5 h-[17px] w-[17px] flex-shrink-0 cursor-pointer accent-brand" />
            <span className="text-[13px] leading-relaxed text-muted">
              Tôi đồng ý với <span className="font-bold text-brand">Điều khoản dịch vụ</span> và{" "}
              <span className="font-bold text-brand">Chính sách bảo mật</span> của airbnb.
            </span>
          </label>

          <button
            onClick={submit}
            disabled={loading}
            className="font-display w-full rounded-[15px] bg-gradient-to-br from-brand to-brand-pink py-4 text-[15.5px] font-extrabold text-white shadow-[0_12px_28px_rgba(14,59,51,.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(14,59,51,.55)] disabled:opacity-60"
          >
            {loading ? "Đang xử lý…" : "Tạo tài khoản →"}
          </button>

          <p className="mt-6 text-center text-[14px] text-muted">
            Đã có tài khoản?{" "}
            <button onClick={() => switchTo("login")} className="font-extrabold text-brand">
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-muted">Đang tải…</div>}>
      <AuthInner />
    </Suspense>
  );
}
