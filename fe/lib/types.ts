// Kiểu dữ liệu khớp với model Prisma của backend NestJS

export interface ViTri {
  id: number;
  tenViTri: string;
  tinhThanh: string | null;
  quocGia: number | null;
  hinhAnh: string | null;
}

export interface Phong {
  id: number;
  tenPhong: string;
  khach: number | null;
  phongNgu: number | null;
  giuong: number | null;
  phongTam: number | null;
  moTa: string | null;
  giaTien: number;
  mayGiat: boolean | null;
  banLa: boolean | null;
  tiVi: boolean | null;
  dieuHoa: boolean | null;
  wifi: boolean | null;
  bep: boolean | null;
  doXe: boolean | null;
  hoBoi: boolean | null;
  banUi: boolean | null;
  hinhAnh: string | null;
  viTri: number | null;
}

export interface BinhLuan {
  id: number;
  maCongViec: number;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string | null;
  noiDung: string | null;
  saoBinhLuan: number | null;
  // include từ backend
  NguoiDungTb?: { id: number; name: string; email: string } | null;
}

export interface DatPhong {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number | null;
  maNguoiDat: number;
}

export interface NguoiDung {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  birthday: string | null;
  gender: string | null;
  role: string | null;
  avatar: string | null;
}

// Response bọc chung của backend (TransformResponseInterceptor)
export interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  content: T;
  dateTime: string;
}
