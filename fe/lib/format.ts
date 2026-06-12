import type { Phong, ViTri } from "./types";

/** Định dạng số tiền VND: 850000 -> "850.000₫" */
export function fmtVnd(n: number): string {
  return Number(n).toLocaleString("vi-VN") + "₫";
}

/** "Đà Lạt, Lâm Đồng" */
export function locName(v?: ViTri | null): string {
  if (!v) return "";
  return v.tinhThanh ? `${v.tenViTri}, ${v.tinhThanh}` : v.tenViTri;
}

/** Dòng tóm tắt: "4 khách · 2 phòng ngủ · 2 giường" */
export function featureLine(p: Phong): string {
  return [
    `${p.khach ?? 1} khách`,
    `${p.phongNgu ?? 1} phòng ngủ`,
    `${p.giuong ?? 1} giường`,
  ].join(" · ");
}

/** Map cột boolean của PhongTb -> nhãn tiện nghi hiển thị */
export const AMENITY_META: { key: keyof Phong; label: string }[] = [
  { key: "wifi", label: "Wifi miễn phí" },
  { key: "dieuHoa", label: "Điều hòa" },
  { key: "bep", label: "Bếp nấu ăn" },
  { key: "mayGiat", label: "Máy giặt" },
  { key: "tiVi", label: "Tivi màn hình phẳng" },
  { key: "hoBoi", label: "Hồ bơi" },
  { key: "doXe", label: "Chỗ đỗ xe miễn phí" },
  { key: "banLa", label: "Bàn là" },
  { key: "banUi", label: "Bàn ủi" },
];

export function amenitiesOf(p: Phong): string[] {
  return AMENITY_META.filter((a) => p[a.key]).map((a) => a.label);
}

/**
 * Bảng dữ liệu không có sẵn trong DB (đánh giá sao trung bình, số lượt) —
 * suy ra ổn định theo id để hiển thị nhất quán, giống bản thiết kế.
 */
export function pseudoRating(id: number): number {
  return Number((4.75 + ((id * 7) % 25) / 100).toFixed(2));
}
export function pseudoReviews(id: number): number {
  return 70 + ((id * 37) % 150);
}

/** Chữ cái đầu cho avatar */
export function initial(name?: string | null): string {
  return (name || "U").trim().charAt(0).toUpperCase();
}
