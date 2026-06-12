import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDatPhongDto } from './dto/create-dat-phong.dto';
import { UpdateDatPhongDto } from './dto/update-dat-phong.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

@Injectable()
export class DatPhongService {
  constructor(private prisma: PrismaService) {}

  //! POST /api/dat-phong — Tạo mới đặt phòng
  async create(createDatPhongDto: CreateDatPhongDto) {
    const { ngayDen, ngayDi, ...rest } = createDatPhongDto;

    return this.prisma.datPhongTb.create({
      data: {
        ...rest,
        ngayDen: new Date(ngayDen),
        ngayDi: new Date(ngayDi),
      },
    });
  }

  //! GET /api/dat-phong — Lấy toàn bộ đặt phòng (chưa bị xoá mềm)
  async findAll() {
    return this.prisma.datPhongTb.findMany({
      where: { isDeleted: false },
    });
  }

  //! GET /api/dat-phong/lay-theo-nguoi-dung/:MaNguoiDung — Lấy đặt phòng theo người dùng
  async layTheoNguoiDung(maNguoiDung: number) {
    return this.prisma.datPhongTb.findMany({
      where: { isDeleted: false, maNguoiDat: maNguoiDung },
    });
  }

  //! GET /api/dat-phong/:id — Lấy chi tiết 1 đặt phòng theo id
  async findOne(id: number) {
    const datPhong = await this.prisma.datPhongTb.findUnique({
      where: { id },
    });
    if (!datPhong || datPhong.isDeleted) {
      throw new NotFoundException(`Không tìm thấy đặt phòng #${id}`);
    }
    return datPhong;
  }

  //! PUT /api/dat-phong/:id — Cập nhật đặt phòng theo id
  async update(id: number, updateDatPhongDto: UpdateDatPhongDto) {
    await this.findOne(id);

    const { ngayDen, ngayDi, ...rest } = updateDatPhongDto;
    const data: any = { ...rest };
    if (ngayDen) data.ngayDen = new Date(ngayDen);
    if (ngayDi) data.ngayDi = new Date(ngayDi);

    return this.prisma.datPhongTb.update({
      where: { id },
      data,
    });
  }

  //! DELETE /api/dat-phong/:id — Xoá mềm đặt phòng (đánh dấu isDeleted)
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.datPhongTb.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return { message: `Đã xoá đặt phòng #${id}` };
  }
}
