import type {
  ApiEnvelope,
  BinhLuan,
  DatPhong,
  NguoiDung,
  Phong,
  ViTri,
} from "./types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3099/api";

// Gốc phục vụ file tĩnh (ảnh) của backend — bỏ hậu tố "/api"
export const ASSET_BASE = API_BASE.replace(/\/api\/?$/, "");

/** Dựng URL đầy đủ cho ảnh trả về dạng đường dẫn tương đối (vd "/avatars/x.jpg"). */
export const assetUrl = (path?: string | null): string =>
  !path ? "" : /^https?:\/\//.test(path) ? path : `${ASSET_BASE}${path}`;

/**
 * Gọi API backend và bóc lớp envelope `{ content }`.
 * `credentials: include` để gửi cookie httpOnly (accessToken) cho route cần auth.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // FormData phải để trình duyệt tự set Content-Type (kèm boundary) — không ép JSON
  const isForm =
    typeof FormData !== "undefined" && init?.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    // Dữ liệu listing đọc trực tiếp từ DB, không cache để luôn mới
    cache: "no-store",
    ...init,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers ?? {}),
    },
  });

  let body: ApiEnvelope<T> | { message?: string } | null = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    // Token hết hạn / không hợp lệ: xoá user lưu local để FE không hiển thị "đã đăng nhập" giả
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("airbnb_user");
    }
    const msg =
      (body && "message" in body && body.message) || `Lỗi API (${res.status})`;
    throw new Error(Array.isArray(msg) ? msg.join(", ") : String(msg));
  }

  return (body as ApiEnvelope<T>).content;
}

// ---- Vị trí ----
export const getViTriList = () => apiFetch<ViTri[]>("/vi-tri");
export const getViTriById = (id: number) => apiFetch<ViTri>(`/vi-tri/${id}`);

// ---- Phòng ----
export const getPhongList = () => apiFetch<Phong[]>("/phong-thue");
export const getPhongById = (id: number) =>
  apiFetch<Phong>(`/phong-thue/${id}`);
export const getPhongByViTri = (maViTri: number) =>
  apiFetch<Phong[]>(`/phong-thue/lay-phong-theo-vi-tri?maViTri=${maViTri}`);

// ---- Bình luận ----
export const getBinhLuanByPhong = (maPhong: number) =>
  apiFetch<BinhLuan[]>(`/binh-luan/lay-binh-luan-theo-phong/${maPhong}`);

// Tạo bình luận — cần đăng nhập (cookie tự gửi qua credentials)
export const createBinhLuan = (body: {
  maCongViec: number;
  maNguoiBinhLuan: number;
  noiDung: string;
  saoBinhLuan: number;
}) =>
  apiFetch<BinhLuan>("/binh-luan", {
    method: "POST",
    body: JSON.stringify(body),
    cache: "no-store",
  });

// ---- Đặt phòng (cần đăng nhập — cookie tự gửi qua credentials) ----
export const createDatPhong = (body: {
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach?: number;
  maNguoiDat: number;
}) =>
  apiFetch<DatPhong>("/dat-phong", {
    method: "POST",
    body: JSON.stringify(body),
    cache: "no-store",
  });

export const getDatPhongByNguoiDung = (maNguoiDung: number) =>
  apiFetch<DatPhong[]>(`/dat-phong/lay-theo-nguoi-dung/${maNguoiDung}`);

// Hủy (xoá) một đặt phòng — cần đăng nhập
export const cancelDatPhong = (id: number) =>
  apiFetch<DatPhong>(`/dat-phong/${id}`, { method: "DELETE", cache: "no-store" });

// ---- Auth ----
export const login = (email: string, password: string) =>
  apiFetch<{ user: NguoiDung; accessToken: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

export const register = (body: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
  birthday?: string;
}) =>
  apiFetch<{ user: NguoiDung; accessToken: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
    cache: "no-store",
  });

// Đăng xuất — xoá cookie httpOnly ở backend
export const logout = () =>
  apiFetch<{ message: string }>("/auth/logout", {
    method: "POST",
    cache: "no-store",
  });

// Lấy user hiện tại từ cookie (rehydrate sau khi reload trang)
export const getMe = () => apiFetch<NguoiDung>("/auth/me");

// Upload ảnh đại diện (multipart/form-data, field "avatar") — cần đăng nhập
export const uploadAvatar = (file: File) => {
  const fd = new FormData();
  fd.append("avatar", file);
  return apiFetch<{ message: string; url: string; user: NguoiDung }>(
    "/users/upload-avatar",
    { method: "POST", body: fd, cache: "no-store" },
  );
};

// Cập nhật thông tin cá nhân (name/phone/gender/birthday — không gồm role)
export const updateProfile = (body: {
  name?: string;
  phone?: string;
  gender?: string;
  birthday?: string;
}) =>
  apiFetch<NguoiDung>("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(body),
    cache: "no-store",
  });
