"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/app/providers";
import { createDatPhong } from "@/lib/api";
import { fmtVnd, locName } from "@/lib/format";
import type { Phong, ViTri } from "@/lib/types";

const CLEANING = 200000;

const PAY_OPTIONS = [
  { key: "card", label: "Thẻ tín dụng / ghi nợ", sub: "Visa, Mastercard, JCB", tag: "VISA", iconBg: "#EEF2FF", iconColor: "#4F46E5" },
  { key: "momo", label: "Ví MoMo", sub: "Thanh toán nhanh qua MoMo", tag: "MoMo", iconBg: "#FDE6F3", iconColor: "#D6336C" },
  { key: "bank", label: "Chuyển khoản ngân hàng", sub: "Internet Banking / QR", tag: "BANK", iconBg: "#E6FAF6", iconColor: "#0E8C7C" },
];

/** yyyy-mm-dd theo giờ địa phương; nếu trống thì mặc định hôm nay (+offset ngày) */
function defaultDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function BookingClient({
  room,
  viTriList,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: {
  room: Phong;
  viTriList: ViTri[];
  initialCheckIn: string;
  initialCheckOut: string;
  initialGuests: number;
}) {
  const router = useRouter();
  const { user, isLoggedIn, flash } = useApp();

  const [checkIn] = useState(initialCheckIn || defaultDate(7));
  const [checkOut] = useState(initialCheckOut || defaultDate(10));
  const [guests] = useState(initialGuests);
  const [pay, setPay] = useState("card");
  const [step, setStep] = useState<"review" | "confirm">("review");
  const [loading, setLoading] = useState(false);

  // Chưa đăng nhập -> chuyển sang trang auth (kèm redirect quay lại)
  useEffect(() => {
    if (!isLoggedIn) {
      const target = `/dat-phong/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;
      router.replace(`/auth?redirect=${encodeURIComponent(target)}`);
    }
  }, [isLoggedIn, router, room.id, checkIn, checkOut, guests]);

  const vt = viTriList.find((v) => v.id === room.viTri);
  const nights = useMemo(() => {
    const d = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
    return d > 0 ? Math.round(d) : 1;
  }, [checkIn, checkOut]);

  const subtotal = room.giaTien * nights;
  const service = Math.round(subtotal * 0.1);
  const total = subtotal + CLEANING + service;
  const img = room.hinhAnh || "";

  const confirm = async () => {
    if (loading || !user) return;
    setLoading(true);
    try {
      await createDatPhong({
        maPhong: room.id,
        ngayDen: new Date(checkIn).toISOString(),
        ngayDi: new Date(checkOut).toISOString(),
        soLuongKhach: guests,
        maNguoiDat: user.id,
      });
      setStep("confirm");
      flash("Đặt phòng thành công! 🎉");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      flash(e instanceof Error ? e.message : "Đặt phòng thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return <div className="py-32 text-center text-muted">Đang chuyển tới đăng nhập…</div>;
  }

  // ----- BƯỚC XÁC NHẬN THÀNH CÔNG -----
  if (step === "confirm") {
    return (
      <div className="mx-auto max-w-[980px] px-5 py-9 pb-22 sm:px-8" style={{ animation: "fadeIn .4s both" }}>
        <div className="pt-10 text-center" style={{ animation: "scaleIn .5s both" }}>
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-pink shadow-[0_18px_44px_rgba(14,59,51,.45)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <h1 className="font-display mt-6.5 text-4xl font-extrabold tracking-[-1px]">Đặt phòng thành công!</h1>
          <p className="mt-3 text-[17px] text-muted">Chúc bạn có một chuyến đi tuyệt vời. Thông tin xác nhận đã được lưu vào chuyến đi của bạn.</p>
        </div>

        <div className="mx-auto mt-9 max-w-[560px] overflow-hidden rounded-[20px] border border-line-2 shadow-[0_16px_44px_rgba(0,0,0,.08)]">
          <div className="flex gap-4 bg-cream p-4.5">
            {img && <Image src={img} alt={room.tenPhong} width={96} height={84} className="h-21 w-24 rounded-xl object-cover" />}
            <div>
              <p className="font-display font-bold">{room.tenPhong}</p>
              <p className="mt-1 text-sm text-muted">{locName(vt)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4.5">
            <Info label="Nhận phòng" value={checkIn} />
            <Info label="Trả phòng" value={checkOut} />
            <Info label="Số khách" value={`${guests} khách`} />
            <Info label="Tổng thanh toán" value={fmtVnd(total)} highlight />
          </div>
        </div>

        <div className="mt-7.5 flex justify-center gap-3.5">
          <button onClick={() => router.push("/profile")} className="rounded-xl bg-gradient-to-br from-brand to-brand-pink px-6.5 py-3.5 font-bold text-white shadow-[0_10px_24px_rgba(14,59,51,.4)]">Xem chuyến đi của tôi</button>
          <button onClick={() => router.push("/")} className="rounded-xl border-[1.5px] border-line-2 bg-white px-6.5 py-3.5 font-bold">Về trang chủ</button>
        </div>
      </div>
    );
  }

  // ----- BƯỚC REVIEW -----
  return (
    <div className="mx-auto max-w-[980px] px-5 py-9 pb-22 sm:px-8" style={{ animation: "fadeIn .4s both" }}>
      <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        Quay lại
      </button>
      <h1 className="font-display mb-7.5 text-[clamp(28px,3.6vw,40px)] font-extrabold tracking-[-1px]">Xác nhận và thanh toán</h1>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display mb-4 text-xl font-bold">Chuyến đi của bạn</h2>
          <div className="mb-6.5 flex flex-col gap-4 border-b border-line pb-6.5">
            <Row label="Ngày" value={`${checkIn} → ${checkOut}`} />
            <Row label="Khách" value={`${guests} khách · ${nights} đêm`} />
          </div>

          <h2 className="font-display mb-4 text-xl font-bold">Phương thức thanh toán</h2>
          <div className="flex flex-col gap-3">
            {PAY_OPTIONS.map((o) => {
              const on = pay === o.key;
              return (
                <button
                  key={o.key}
                  onClick={() => setPay(o.key)}
                  className={`flex items-center justify-between rounded-[14px] border-[1.5px] px-4.5 py-3.5 text-left transition ${on ? "border-brand bg-[#eef3f0]" : "border-line-2 bg-white"}`}
                >
                  <span className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[10px] text-[13px] font-extrabold" style={{ background: o.iconBg, color: o.iconColor }}>{o.tag}</span>
                    <span>
                      <span className="block text-[15px] font-bold">{o.label}</span>
                      <span className="mt-px block text-[13px] text-muted-2">{o.sub}</span>
                    </span>
                  </span>
                  <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2" style={{ borderColor: on ? "#0E5345" : "#D7D7DD" }}>
                    <span className="h-[11px] w-[11px] rounded-full" style={{ background: on ? "#0E5345" : "transparent" }} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3.5">
            <CardInput label="Số thẻ" placeholder="1234 5678 9012 3456" />
            <CardInput label="Chủ thẻ" placeholder="NGUYEN VAN A" />
            <CardInput label="Hết hạn" placeholder="MM/YY" />
            <CardInput label="CVV" placeholder="123" />
          </div>
        </div>

        {/* Tóm tắt giá */}
        <div className="lg:sticky lg:top-[100px] rounded-[22px] border border-line-2 p-6 shadow-[0_16px_44px_rgba(0,0,0,.1)]">
          <div className="flex gap-3.5 border-b border-line pb-5">
            {img && <Image src={img} alt={room.tenPhong} width={100} height={88} className="h-22 w-25 rounded-xl object-cover" />}
            <div>
              <p className="font-display text-[15.5px] leading-tight font-bold">{room.tenPhong}</p>
              <p className="mt-1.5 text-[13.5px] text-muted">{locName(vt)}</p>
            </div>
          </div>
          <h3 className="font-display mt-5 mb-3.5 text-[17px] font-bold">Chi tiết giá</h3>
          <div className="flex flex-col gap-2.5 text-[14.5px] text-ink-soft">
            <div className="flex justify-between"><span>{fmtVnd(room.giaTien)} × {nights} đêm</span><span>{fmtVnd(subtotal)}</span></div>
            <div className="flex justify-between"><span>Phí dọn dẹp</span><span>{fmtVnd(CLEANING)}</span></div>
            <div className="flex justify-between"><span>Phí dịch vụ</span><span>{fmtVnd(service)}</span></div>
            <div className="mt-1 flex justify-between border-t border-line pt-3.5 text-[16.5px] font-extrabold text-ink"><span>Tổng (VND)</span><span>{fmtVnd(total)}</span></div>
          </div>
          <button onClick={confirm} disabled={loading} className="mt-5.5 w-full rounded-[14px] bg-gradient-to-br from-brand to-brand-pink py-3.5 text-base font-bold text-white shadow-[0_10px_24px_rgba(14,59,51,.4)] transition-transform hover:-translate-y-px disabled:opacity-60">
            {loading ? "Đang xử lý…" : "Xác nhận và thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[15px] font-bold">{label}</div>
        <div className="mt-0.5 text-sm text-muted">{value}</div>
      </div>
    </div>
  );
}

function Info({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-xs font-extrabold tracking-wide text-muted-2 uppercase">{label}</div>
      <div className={`mt-1 font-bold ${highlight ? "text-brand" : ""}`}>{value}</div>
    </div>
  );
}

function CardInput({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold">{label}</span>
      <input placeholder={placeholder} className="rounded-xl border-[1.5px] border-line-2 px-3.5 py-3 text-sm outline-none focus:border-brand" />
    </label>
  );
}
