"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useApp } from "@/app/providers";
import { createBinhLuan, getBinhLuanByPhong } from "@/lib/api";
import RoomCard from "@/components/room-card";
import {
  amenitiesOf,
  featureLine,
  fmtVnd,
  initial,
  locName,
  pseudoRating,
  pseudoReviews,
} from "@/lib/format";
import type { BinhLuan, Phong, ViTri } from "@/lib/types";

const FALLBACK =
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80&auto=format&fit=crop";
const CLEANING = 200000;

const RATING_LABELS = [
  "Mức độ sạch sẽ",
  "Độ chính xác",
  "Liên lạc",
  "Vị trí",
  "Nhận phòng",
  "Giá trị",
];

function fmtMonth(d: string | null): string {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
}

export default function DetailClient({
  room,
  viTriList,
  comments,
  related,
}: {
  room: Phong;
  viTriList: ViTri[];
  comments: BinhLuan[];
  related: Phong[];
}) {
  const router = useRouter();
  const { user, isFav, toggleFav, isLoggedIn, flash } = useApp();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  // Danh sách bình luận giữ trong state để cập nhật ngay sau khi đăng
  const [cmts, setCmts] = useState<BinhLuan[]>(comments);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [posting, setPosting] = useState(false);

  const vt = viTriList.find((v) => v.id === room.viTri);
  const fav = isFav(room.id);
  const rating = pseudoRating(room.id);
  const reviews = cmts.length || pseudoReviews(room.id);

  const submitComment = async () => {
    if (posting) return;
    if (!isLoggedIn || !user) {
      flash("Vui lòng đăng nhập để bình luận");
      router.push(`/auth?redirect=/phong/${room.id}`);
      return;
    }
    if (!newText.trim()) {
      flash("Vui lòng nhập nội dung đánh giá");
      return;
    }
    setPosting(true);
    try {
      await createBinhLuan({
        maCongViec: room.id,
        maNguoiBinhLuan: user.id,
        noiDung: newText.trim(),
        saoBinhLuan: newRating,
      });
      // Lấy lại danh sách để có kèm tên người bình luận
      setCmts(await getBinhLuanByPhong(room.id));
      setNewText("");
      setNewRating(5);
      flash("Cảm ơn đánh giá của bạn! ⭐");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Đăng bình luận thất bại");
    } finally {
      setPosting(false);
    }
  };
  const amenities = amenitiesOf(room);
  const img = room.hinhAnh || FALLBACK;

  const nights = useMemo(() => {
    if (checkIn && checkOut) {
      const d = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
      if (d > 0) return Math.round(d);
    }
    return 3;
  }, [checkIn, checkOut]);

  const subtotal = room.giaTien * nights;
  const service = Math.round(subtotal * 0.1);
  const total = subtotal + CLEANING + service;

  const onBook = () => {
    if (!checkIn || !checkOut) {
      flash("Vui lòng chọn ngày nhận và trả phòng");
      return;
    }
    if (new Date(checkOut).getTime() <= new Date(checkIn).getTime()) {
      flash("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }
    const qs = `checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;
    const target = `/dat-phong/${room.id}?${qs}`;
    if (!isLoggedIn) {
      flash("Vui lòng đăng nhập để đặt phòng");
      router.push(`/auth?redirect=${encodeURIComponent(target)}`);
      return;
    }
    router.push(target);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 pb-20 sm:px-8 lg:px-13" style={{ animation: "fadeIn .4s both" }}>
      <Link href="/phong" className="mb-4.5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        Quay lại danh sách
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(26px,3.4vw,40px)] leading-[1.1] font-extrabold tracking-[-1px]">{room.tenPhong}</h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[14.5px] font-semibold">
            <span className="inline-flex items-center gap-1.5"><span className="text-gold">★</span>{rating.toFixed(2)}</span>
            <span className="text-[#c7c7ce]">·</span>
            <span className="underline">{reviews} đánh giá</span>
            <span className="text-[#c7c7ce]">·</span>
            <span className="text-muted">{locName(vt)}</span>
          </div>
        </div>
        <button onClick={() => toggleFav(room.id)} className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-line-2 bg-white px-4 py-2.5 text-sm font-bold hover:bg-cream">
          <svg width="17" height="17" viewBox="0 0 24 24" fill={fav ? "#C8A24A" : "none"} stroke="#0E5345" strokeWidth="2"><path d="M12 21s-7.5-4.6-10-9.2C.2 8.3 2 4.5 6 4.5c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3 4 0 5.8 3.8 4 7.3C19.5 16.4 12 21 12 21z" /></svg>
          Lưu
        </button>
      </div>

      {/* Ảnh chính */}
      <div className="relative mt-5.5 aspect-[16/7] overflow-hidden rounded-[22px] bg-[#f0f0f3]">
        <Image src={img} alt={room.tenPhong} fill priority sizes="(max-width:1200px) 100vw, 1200px" className="object-cover" />
      </div>

      <div className="mt-11 grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.7fr_1fr]">
        {/* CỘT TRÁI */}
        <div>
          <div className="flex items-center justify-between gap-4 border-b border-line pb-6.5">
            <div>
              <h2 className="font-display text-[21px] font-bold">Toàn bộ chỗ ở · {vt?.tenViTri ?? ""}</h2>
              <p className="mt-1.5 text-[15px] text-muted">{featureLine(room)} · {room.phongTam ?? 1} phòng tắm</p>
            </div>
          </div>

          <p className="my-6.5 border-b border-line pb-6.5 text-[15.5px] leading-[1.75] text-ink-soft">{room.moTa}</p>

          <h2 className="font-display mb-4.5 text-[21px] font-bold">Nơi này có những gì cho bạn</h2>
          <div className="grid grid-cols-1 gap-x-5 gap-y-3.5 border-b border-line pb-7 sm:grid-cols-2">
            {amenities.map((a) => (
              <div key={a} className="flex items-center gap-3.5 text-[15px] font-medium text-ink-soft">
                <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] bg-[#eef3f0]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E5345" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                {a}
              </div>
            ))}
          </div>

          <h2 className="font-display mt-7.5 flex items-center gap-2.5 text-[21px] font-bold"><span className="text-gold">★</span>{rating.toFixed(2)} · {reviews} đánh giá</h2>
          <div className="my-5.5 grid grid-cols-1 gap-x-11 gap-y-3 sm:grid-cols-2">
            {RATING_LABELS.map((lab, i) => {
              const val = (4.7 + ((i * 7) % 4) / 10).toFixed(1);
              const pct = 88 + ((i * 7) % 4) * 3;
              return (
                <div key={lab} className="flex items-center gap-3">
                  <span className="min-w-[116px] text-sm text-ink-soft">{lab}</span>
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-[#eaeaee]"><span className="block h-full rounded-full bg-ink" style={{ width: `${pct}%` }} /></span>
                  <span className="min-w-[26px] text-right text-[13.5px] font-bold">{val}</span>
                </div>
              );
            })}
          </div>

          {/* Form viết đánh giá */}
          <div className="mb-8 rounded-[18px] border border-line-2 p-5">
            <h3 className="font-display mb-3 text-[17px] font-bold">Chia sẻ đánh giá của bạn</h3>
            {isLoggedIn ? (
              <>
                <div className="mb-3 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      aria-label={`${s} sao`}
                      className={`text-[26px] leading-none transition-transform hover:scale-110 ${s <= newRating ? "text-gold" : "text-line-2"}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-muted">{newRating}/5</span>
                </div>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  rows={3}
                  placeholder="Cảm nhận của bạn về chỗ ở này…"
                  className="w-full resize-none rounded-xl border-[1.5px] border-line-2 px-3.5 py-3 text-[14.5px] outline-none focus:border-brand"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={submitComment}
                    disabled={posting}
                    className="rounded-xl bg-gradient-to-br from-brand to-brand-pink px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(14,59,51,.35)] transition-transform hover:-translate-y-px disabled:opacity-60"
                  >
                    {posting ? "Đang gửi…" : "Gửi đánh giá"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-[14.5px] text-muted">
                <button
                  onClick={() => router.push(`/auth?redirect=/phong/${room.id}`)}
                  className="font-bold text-brand underline underline-offset-2"
                >
                  Đăng nhập
                </button>{" "}
                để chia sẻ đánh giá về chỗ ở này.
              </p>
            )}
          </div>

          {cmts.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-10 gap-y-6.5 sm:grid-cols-2">
              {cmts.map((c) => {
                const name = c.NguoiDungTb?.name ?? "Khách";
                const stars = "★".repeat(c.saoBinhLuan ?? 5) + "☆".repeat(5 - (c.saoBinhLuan ?? 5));
                return (
                  <div key={c.id}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f1f4] text-base font-bold text-muted">{initial(name)}</div>
                      <div>
                        <p className="text-[15px] font-bold">{name}</p>
                        <p className="mt-0.5 text-[13px] text-muted-2">{fmtMonth(c.ngayBinhLuan)}</p>
                      </div>
                    </div>
                    <div className="my-3 text-[13px] tracking-[2px] text-gold">{stars}</div>
                    <p className="text-[14.5px] leading-[1.65] text-ink-soft">{c.noiDung}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[14.5px] text-muted">Chưa có đánh giá nào — hãy là người đầu tiên!</p>
          )}
        </div>

        {/* CỘT PHẢI — Booking */}
        <div className="lg:sticky lg:top-[100px]">
          <div className="rounded-[22px] border border-line-2 p-6.5 shadow-[0_16px_44px_rgba(0,0,0,.1)]">
            <div className="mb-5 flex items-baseline gap-1.5">
              <span className="font-display text-[26px] font-extrabold">{fmtVnd(room.giaTien)}</span>
              <span className="text-[15px] text-muted">/ đêm</span>
            </div>
            <div className="overflow-hidden rounded-[14px] border border-[#dfdfe4]">
              <div className="grid grid-cols-2">
                <label className="cursor-pointer border-r border-[#dfdfe4] px-3.5 py-2.5">
                  <div className="text-[10.5px] font-extrabold tracking-wide uppercase">Nhận phòng</div>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-transparent pt-0.5 text-[13.5px] font-semibold text-muted outline-none" />
                </label>
                <label className="cursor-pointer px-3.5 py-2.5">
                  <div className="text-[10.5px] font-extrabold tracking-wide uppercase">Trả phòng</div>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-transparent pt-0.5 text-[13.5px] font-semibold text-muted outline-none" />
                </label>
              </div>
              <div className="flex items-center justify-between border-t border-[#dfdfe4] px-3.5 py-2.5">
                <div>
                  <div className="text-[10.5px] font-extrabold tracking-wide uppercase">Khách</div>
                  <div className="pt-0.5 text-[13.5px] font-semibold text-muted">{guests} khách</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setGuests((g) => Math.max(1, g - 1))} className="h-7 w-7 rounded-full border-[1.5px] border-[#d7d7dd] text-[17px] text-muted">−</button>
                  <span className="min-w-3.5 text-center font-bold">{guests}</span>
                  <button onClick={() => setGuests((g) => Math.min(room.khach ?? 16, g + 1))} className="h-7 w-7 rounded-full border-[1.5px] border-[#d7d7dd] text-[17px] text-muted">+</button>
                </div>
              </div>
            </div>
            <button onClick={onBook} className="mt-4 w-full rounded-[14px] bg-gradient-to-br from-brand to-brand-pink py-3.5 text-base font-bold text-white shadow-[0_10px_24px_rgba(14,59,51,.4)] transition-transform hover:-translate-y-px">
              Đặt phòng
            </button>
            <p className="my-3 text-center text-[13px] text-muted-2">Bạn vẫn chưa bị trừ tiền</p>
            <div className="flex flex-col gap-2.5 text-[14.5px] text-ink-soft">
              <div className="flex justify-between"><span className="underline">{fmtVnd(room.giaTien)} × {nights} đêm</span><span>{fmtVnd(subtotal)}</span></div>
              <div className="flex justify-between"><span className="underline">Phí dọn dẹp</span><span>{fmtVnd(CLEANING)}</span></div>
              <div className="flex justify-between"><span className="underline">Phí dịch vụ</span><span>{fmtVnd(service)}</span></div>
              <div className="mt-1 flex justify-between border-t border-line pt-3.5 text-base font-extrabold text-ink"><span>Tổng cộng</span><span>{fmtVnd(total)}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* GỢI Ý */}
      {related.length > 0 && (
        <div className="mt-15 border-t border-line pt-10">
          <h2 className="font-display mb-5.5 text-[26px] font-extrabold tracking-[-.5px]">Có thể bạn cũng thích</h2>
          <div className="grid grid-cols-1 gap-6.5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <RoomCard key={r.id} room={r} viTriList={viTriList} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
