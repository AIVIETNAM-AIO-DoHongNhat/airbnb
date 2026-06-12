"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/app/providers";
import RoomCard from "@/components/room-card";
import { Icon } from "@/components/icons";
import {
  assetUrl,
  cancelDatPhong,
  getDatPhongByNguoiDung,
  getPhongList,
  getViTriList,
  updateProfile,
  uploadAvatar,
} from "@/lib/api";
import { fmtVnd, initial, locName } from "@/lib/format";
import type { DatPhong, NguoiDung, Phong, ViTri } from "@/lib/types";

type Tab = "trips" | "favs" | "info";

export default function ProfilePage() {
  const router = useRouter();
  const { user, ready, isLoggedIn, favorites, logout, setUser, flash } = useApp();
  const [tab, setTab] = useState<Tab>("trips");
  const [bookings, setBookings] = useState<DatPhong[]>([]);
  const [rooms, setRooms] = useState<Phong[]>([]);
  const [viTriList, setViTriList] = useState<ViTri[]>([]);
  const [loading, setLoading] = useState(true);

  // Hủy chuyến: id đang chờ xác nhận / id đang gọi API
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  // Form thông tin cá nhân (không gồm email/role)
  const [form, setForm] = useState({ name: "", phone: "", gender: "", birthday: "" });
  const [saving, setSaving] = useState(false);

  // Upload ảnh đại diện
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const onPickAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset để có thể chọn lại cùng một tệp
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      flash("Vui lòng chọn tệp ảnh");
      return;
    }
    setUploadingAvatar(true);
    try {
      const { user: updated } = await uploadAvatar(file);
      setUser({ ...user, ...updated } as NguoiDung);
      flash("Đã cập nhật ảnh đại diện");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Tải ảnh thất bại");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Nạp dữ liệu form từ user hiện tại
  useEffect(() => {
    if (user)
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        gender: user.gender ?? "",
        birthday: user.birthday ? user.birthday.slice(0, 10) : "",
      });
  }, [user]);

  const handleCancel = async (id: number) => {
    if (cancelingId) return;
    setCancelingId(id);
    try {
      await cancelDatPhong(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      flash("Đã hủy chuyến đi");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Hủy chuyến thất bại");
    } finally {
      setCancelingId(null);
      setConfirmCancelId(null);
    }
  };

  const handleSave = async () => {
    if (saving || !user) return;
    if (!form.name.trim()) {
      flash("Vui lòng nhập họ và tên");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
        gender: form.gender || undefined,
        birthday: form.birthday || undefined,
      });
      setUser({ ...user, ...updated } as NguoiDung);
      flash("Đã cập nhật thông tin");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  // Bảo vệ route: chờ context sẵn sàng rồi mới quyết định
  useEffect(() => {
    if (ready && !isLoggedIn) router.replace("/auth?redirect=/profile");
  }, [ready, isLoggedIn, router]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [b, r, v] = await Promise.all([
          getDatPhongByNguoiDung(user.id).catch(() => [] as DatPhong[]),
          getPhongList().catch(() => [] as Phong[]),
          getViTriList().catch(() => [] as ViTri[]),
        ]);
        if (!active) return;
        setBookings(b);
        setRooms(r);
        setViTriList(v);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  if (!ready || !user) {
    return <div className="py-32 text-center text-muted">Đang tải…</div>;
  }

  const roomById = (id: number) => rooms.find((r) => r.id === id);
  const favRooms = rooms.filter((r) => favorites[r.id]);

  const TABS: { key: Tab; label: string }[] = [
    { key: "trips", label: "Chuyến đi" },
    { key: "favs", label: `Yêu thích (${favRooms.length})` },
    { key: "info", label: "Thông tin cá nhân" },
  ];

  return (
    <div className="mx-auto max-w-[1120px] px-5 py-9 pb-22 sm:px-8 lg:px-13" style={{ animation: "fadeIn .4s both" }}>
      {/* Header hồ sơ */}
      <div className="flex flex-wrap items-center gap-5.5 rounded-3xl border border-[#d7e5df] p-7.5" style={{ background: "linear-gradient(120deg,#EEF3F0,#F7F1E1)" }}>
        <div className="relative h-22 w-22 flex-shrink-0">
          {user.avatar ? (
            <Image
              src={assetUrl(user.avatar)}
              alt={user.name}
              width={88}
              height={88}
              className="h-22 w-22 rounded-full object-cover shadow-[0_12px_30px_rgba(14,59,51,.32)]"
            />
          ) : (
            <div className="flex h-22 w-22 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-pink font-display text-4xl font-extrabold text-white shadow-[0_12px_30px_rgba(14,59,51,.32)]">
              {initial(user.name)}
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadingAvatar}
            aria-label="Đổi ảnh đại diện"
            className="absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-[0_4px_12px_rgba(14,59,51,.35)] transition-transform hover:scale-110 disabled:opacity-60"
          >
            {uploadingAvatar ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <Icon name="camera" size={16} strokeWidth={2} />
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPickAvatar} className="hidden" />
        </div>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-extrabold tracking-[-.6px]">{user.name}</h1>
          <p className="mt-1.5 text-[15px] text-muted">{user.email}{user.phone ? ` · ${user.phone}` : ""}</p>
        </div>
        <button onClick={() => { logout(); router.push("/"); }} className="rounded-xl bg-ink px-4.5 py-2.5 text-sm font-bold text-white hover:opacity-90">
          Đăng xuất
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-7.5 mb-6.5 flex gap-1.5 border-b border-line">
        {TABS.map((t) => {
          const on = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`border-b-[2.5px] px-5 py-3.5 text-[15px] font-bold whitespace-nowrap transition ${on ? "border-brand text-ink" : "border-transparent text-muted-2"}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted">Đang tải dữ liệu…</div>
      ) : tab === "trips" ? (
        bookings.length === 0 ? (
          <EmptyTrips onExplore={() => router.push("/phong")} />
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((bk) => {
              const room = roomById(bk.maPhong);
              const vt = viTriList.find((v) => v.id === room?.viTri);
              const nights = Math.max(
                1,
                Math.round((new Date(bk.ngayDi).getTime() - new Date(bk.ngayDen).getTime()) / 86400000),
              );
              // Khớp công thức trang đặt phòng: tiền phòng + phí dọn (200k) + 10% phí dịch vụ
              const subtotal = room ? room.giaTien * nights : 0;
              const total = room ? subtotal + 200000 + Math.round(subtotal * 0.1) : 0;
              return (
                <div key={bk.id} className="flex flex-wrap items-center gap-5 rounded-[18px] border border-line-2 p-4 transition-shadow hover:shadow-[0_12px_32px_rgba(0,0,0,.08)]">
                  {room?.hinhAnh && (
                    <Image src={room.hinhAnh} alt={room.tenPhong} width={130} height={100} className="h-25 w-[130px] rounded-[14px] object-cover" />
                  )}
                  <div className="min-w-[180px] flex-1">
                    <span className="inline-block rounded-full bg-[#e6faf6] px-2.5 py-1 text-xs font-bold text-[#0e8c7c]">Đã đặt</span>
                    <h3 className="font-display mt-2 text-lg font-bold">{room?.tenPhong ?? `Phòng #${bk.maPhong}`}</h3>
                    <p className="mt-1 text-sm text-muted">{locName(vt)}</p>
                    <p className="mt-0.5 text-[13.5px] text-muted-2">
                      {bk.ngayDen.slice(0, 10)} → {bk.ngayDi.slice(0, 10)} · {bk.soLuongKhach ?? 1} khách
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-[19px] font-extrabold">{fmtVnd(total)}</div>
                    <div className="mt-0.5 text-[13px] text-muted-2">Tổng cộng</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {confirmCancelId === bk.id ? (
                      <>
                        <button
                          onClick={() => handleCancel(bk.id)}
                          disabled={cancelingId === bk.id}
                          className="rounded-xl bg-gradient-to-br from-brand to-brand-pink px-3.5 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(14,59,51,.3)] disabled:opacity-60"
                        >
                          {cancelingId === bk.id ? "Đang hủy…" : "Xác nhận hủy"}
                        </button>
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          disabled={cancelingId === bk.id}
                          className="rounded-xl border-[1.5px] border-line-2 px-3.5 py-2.5 text-[13px] font-bold transition-colors hover:bg-cream disabled:opacity-60"
                        >
                          Giữ lại
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmCancelId(bk.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border-[1.5px] border-line-2 px-4 py-2.5 text-[13px] font-bold text-muted transition-colors hover:border-brand hover:text-brand"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        Hủy chuyến
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : tab === "favs" ? (
        favRooms.length === 0 ? (
          <EmptyFavs onExplore={() => router.push("/phong")} />
        ) : (
          <div className="grid grid-cols-1 gap-6.5 sm:grid-cols-2 lg:grid-cols-3">
            {favRooms.map((r, i) => (
              <RoomCard key={r.id} room={r} viTriList={viTriList} index={i} />
            ))}
          </div>
        )
      ) : (
        <div className="max-w-[620px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <EditField label="Họ và tên" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <ReadField label="Email" value={user.email} />
            <EditField label="Số điện thoại" type="tel" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
            <GenderField value={form.gender} onChange={(v) => setForm((f) => ({ ...f, gender: v }))} />
            <EditField label="Ngày sinh" type="date" value={form.birthday} onChange={(v) => setForm((f) => ({ ...f, birthday: v }))} />
            <ReadField label="Vai trò" value={user.role === "ADMIN" ? "Quản trị" : "Khách"} />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 rounded-xl bg-gradient-to-br from-brand to-brand-pink px-6.5 py-3.5 font-bold text-white shadow-[0_10px_24px_rgba(14,59,51,.32)] transition-transform hover:-translate-y-px disabled:opacity-60"
          >
            {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </div>
      )}
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block rounded-2xl border border-line-2 px-5 py-3.5 transition-colors focus-within:border-brand">
      <span className="block text-[12.5px] font-extrabold tracking-wide text-muted-2 uppercase">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-transparent text-base font-bold text-ink outline-none"
      />
    </label>
  );
}

function GenderField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block rounded-2xl border border-line-2 px-5 py-3.5 transition-colors focus-within:border-brand">
      <span className="block text-[12.5px] font-extrabold tracking-wide text-muted-2 uppercase">Giới tính</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full cursor-pointer bg-transparent text-base font-bold text-ink outline-none"
      >
        <option value="">— Chọn —</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
        <option value="Khác">Khác</option>
      </select>
    </label>
  );
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line-2 bg-cream px-5 py-3.5">
      <span className="block text-[12.5px] font-extrabold tracking-wide text-muted-2 uppercase">{label}</span>
      <div className="mt-1 text-base font-bold text-muted">{value}</div>
      <span className="mt-0.5 block text-[11px] text-muted-2">Không thể thay đổi</span>
    </div>
  );
}

function EmptyTrips({ onExplore }: { onExplore: () => void }) {
  return (
    <Empty
      title="Chưa có chuyến đi nào"
      desc="Khi bạn đặt phòng, chuyến đi sẽ xuất hiện ở đây."
      onExplore={onExplore}
    />
  );
}
function EmptyFavs({ onExplore }: { onExplore: () => void }) {
  return (
    <Empty
      title="Chưa có chỗ ở yêu thích"
      desc="Nhấn vào biểu tượng trái tim để lưu những nơi bạn thích."
      onExplore={onExplore}
    />
  );
}
function Empty({ title, desc, onExplore }: { title: string; desc: string; onExplore: () => void }) {
  return (
    <div className="rounded-[22px] border-[1.5px] border-dashed border-line-2 px-5 py-[70px] text-center">
      <div className="mx-auto mb-4.5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef3f0]">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0E5345" strokeWidth="2"><path d="M12 21s-7.5-4.6-10-9.2C.2 8.3 2 4.5 6 4.5c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3 4 0 5.8 3.8 4 7.3C19.5 16.4 12 21 12 21z" /></svg>
      </div>
      <h3 className="font-display text-[19px] font-bold">{title}</h3>
      <p className="mt-2 mb-5 text-[14.5px] text-muted">{desc}</p>
      <button onClick={onExplore} className="rounded-xl bg-gradient-to-br from-brand to-brand-pink px-6 py-3 text-[14.5px] font-bold text-white">Khám phá chỗ ở</button>
    </div>
  );
}
