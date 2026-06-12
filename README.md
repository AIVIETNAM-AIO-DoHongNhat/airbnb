# 🏡 Airbnb

Ứng dụng đặt phòng lưu trú lấy cảm hứng từ Airbnb — đồ án full‑stack (CyberSoft).
Người dùng có thể khám phá chỗ ở khắp Việt Nam, xem chi tiết, đặt phòng, đánh giá và quản lý hồ sơ cá nhân.

> Giao diện theo phong cách **sang trọng** (tông xanh lục đậm + vàng đồng), có trang giới thiệu, danh sách chỗ ở, trải nghiệm và dịch vụ concierge.

## ✨ Tính năng chính

- 🔎 **Khám phá chỗ ở**: lọc theo địa điểm, tìm kiếm theo ngày & số khách.
- 🏨 **Chi tiết phòng**: hình ảnh, tiện nghi, đánh giá, gợi ý phòng tương tự.
- 📅 **Đặt phòng**: chọn ngày → xác nhận → thanh toán (demo), kèm hủy chuyến đi.
- ⭐ **Bình luận & đánh giá** cho từng chỗ ở.
- 👤 **Tài khoản**: đăng ký / đăng nhập (cookie httpOnly), cập nhật hồ sơ, **upload avatar**, danh sách chuyến đi & yêu thích.
- 🧭 Các trang phụ: **Trải nghiệm** và **Dịch vụ concierge**.

## 🛠️ Công nghệ

| Phần | Stack |
|------|-------|
| **Frontend** (`fe/`) | Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 |
| **Backend** (`be/`)  | NestJS · Prisma · MySQL · JWT (cookie httpOnly) · Swagger |

## 📁 Cấu trúc

```
airbnb/
├─ be/        # API backend (NestJS + Prisma)
├─ fe/        # Giao diện web (Next.js)
└─ data.sql   # Dữ liệu mẫu (tuỳ chọn)
```

## 🚀 Cài đặt & chạy

**Yêu cầu:** Node.js 18+, MySQL.

### 1) Backend (`be/`)

```bash
cd be
npm install
# Tạo file .env (DATABASE_URL, JWT secrets, PORT=3099...)
npx prisma generate
node prisma/seed.cjs      # tạo dữ liệu mẫu: 8 vị trí, 10 phòng, 6 user, bình luận
npm run start:dev
```

- API: `http://localhost:3099/api`
- Swagger: `http://localhost:3099/docs`
- Response bọc dạng `{ statusCode, message, content, dateTime }`.

### 2) Frontend (`fe/`)

```bash
cd fe
npm install
npm run dev
```

- Web: `http://localhost:3000`
- API base cấu hình qua `NEXT_PUBLIC_API_URL` (mặc định `http://localhost:3099/api`).

> Chạy **backend trước**, sau đó mới chạy frontend.

## 🔑 Tài khoản demo
nhat@gmail.com - 123456
# 📌 Ghi chú

- Auth dùng **cookie httpOnly**; trạng thái đăng nhập được đọc sẵn phía server để tránh nhấp nháy khi tải trang.
- Ảnh demo lấy từ Unsplash; ảnh upload (avatar, phòng) phục vụ tĩnh từ backend tại `/avatars`, `/...`.

---

