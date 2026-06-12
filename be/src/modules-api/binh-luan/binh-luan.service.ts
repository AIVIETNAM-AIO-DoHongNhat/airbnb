import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';
import { UpdateBinhLuanDto } from './dto/update-binh-luan.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

@Injectable()
export class BinhLuanService {
  constructor(private prisma: PrismaService) {}

  //! POST /api/binh-luan — Tạo mới bình luận
  async create(createBinhLuanDto: CreateBinhLuanDto) {
    return this.prisma.binhLuanTb.create({
      // ngayBinhLuan để DB tự gán (default now)
      data: createBinhLuanDto,
    });
  }

  // Kèm tên + email người bình luận để FE hiển thị mà không cần gọi thêm API
  private readonly includeNguoiBinhLuan = {
    NguoiDungTb: { select: { id: true, name: true, email: true } },
  };

  //! GET /api/binh-luan — Lấy toàn bộ bình luận (chưa bị xoá mềm)
  async findAll() {
    return this.prisma.binhLuanTb.findMany({
      where: { isDeleted: false },
      include: this.includeNguoiBinhLuan,
      orderBy: { id: 'desc' },
    });
  }

  //! GET /api/binh-luan/lay-binh-luan-theo-phong/:MaPhong — Lấy bình luận theo phòng
  async layBinhLuanTheoPhong(maPhong: number) {
    return this.prisma.binhLuanTb.findMany({
      where: { isDeleted: false, maCongViec: maPhong },
      include: this.includeNguoiBinhLuan,
      orderBy: { id: 'desc' },
    });
  }

  //! Helper: tìm 1 bình luận theo id (dùng cho update/delete)
  async findOne(id: number) {
    const binhLuan = await this.prisma.binhLuanTb.findUnique({
      where: { id },
    });
    if (!binhLuan || binhLuan.isDeleted) {
      throw new NotFoundException(`Không tìm thấy bình luận #${id}`);
    }
    return binhLuan;
  }

  //! PUT /api/binh-luan/:id — Cập nhật bình luận theo id
  async update(id: number, updateBinhLuanDto: UpdateBinhLuanDto) {
    await this.findOne(id);

    return this.prisma.binhLuanTb.update({
      where: { id },
      data: updateBinhLuanDto,
    });
  }

  //! DELETE /api/binh-luan/:id — Xoá mềm bình luận (đánh dấu isDeleted)
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.binhLuanTb.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return { message: `Đã xoá bình luận #${id}` };
  }
}
