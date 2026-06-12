import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePhongDto } from './dto/create-phong.dto';
import { UpdatePhongDto } from './dto/update-phong.dto';
import { PhanTrangTimKiemDto } from './dto/phan-trang-tim-kiem.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { phanTrang } from 'src/common/helpers/pagination.helper';
import { buildSafeImageName } from 'src/common/helpers/upload.helper';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

@Injectable()
export class PhongService {
  constructor(private prisma: PrismaService) {}

  //! POST /api/phong-thue — Tạo mới phòng
  async create(createPhongDto: CreatePhongDto) {
    return this.prisma.phongTb.create({
      data: createPhongDto,
    });
  }

  //! GET /api/phong-thue — Lấy toàn bộ phòng (chưa bị xoá mềm)
  async findAll() {
    return this.prisma.phongTb.findMany({
      where: { isDeleted: false },
    });
  }

  //! GET /api/phong-thue/lay-phong-theo-vi-tri?maViTri= — Lấy phòng theo vị trí
  async layPhongTheoViTri(maViTri: number) {
    return this.prisma.phongTb.findMany({
      where: { isDeleted: false, viTri: maViTri },
    });
  }

  //! GET /api/phong-thue/phan-trang-tim-kiem — Phân trang + tìm kiếm theo tên phòng
  async phanTrangTimKiem(query: PhanTrangTimKiemDto) {
    const keyword = query.keyword ?? '';

    return phanTrang(this.prisma.phongTb, {
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
      where: {
        isDeleted: false,
        tenPhong: { contains: keyword }, 
      },
      orderBy: { id: 'desc' },
    });
  }

  //! GET /api/phong-thue/:id — Lấy chi tiết 1 phòng theo id
  async findOne(id: number) {
    const phong = await this.prisma.phongTb.findUnique({
      where: { id },
    });
    if (!phong || phong.isDeleted) {
      throw new NotFoundException(`Không tìm thấy phòng #${id}`);
    }
    return phong;
  }

  //! PUT /api/phong-thue/:id — Cập nhật phòng theo id
  async update(id: number, updatePhongDto: UpdatePhongDto) {
    await this.findOne(id);

    return this.prisma.phongTb.update({
      where: { id },
      data: updatePhongDto,
    });
  }

  //! DELETE /api/phong-thue/:id — Xoá mềm phòng (đánh dấu isDeleted)
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.phongTb.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return { message: `Đã xoá phòng #${id}` };
  }

  //! POST /api/phong-thue/upload-hinh-phong?maPhong= — Upload hình cho phòng
  async uploadHinhPhong(maPhong: number, file: any) {
    // Validate mimetype/size + sinh tên file an toàn (chặn path-traversal)
    const fileName = buildSafeImageName(file, maPhong, Date.now());

    await this.findOne(maPhong);

    const folder = join(process.cwd(), 'public', 'phong');
    await mkdir(folder, { recursive: true });

    await writeFile(join(folder, fileName), file.buffer);

    const url = `/phong/${fileName}`;
    await this.prisma.phongTb.update({
      where: { id: maPhong },
      data: { hinhAnh: url },
    });

    return { message: 'Upload hình phòng thành công', fileName, url };
  }
}
