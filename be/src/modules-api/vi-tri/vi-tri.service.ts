import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateViTriDto } from './dto/create-vi-tri.dto';
import { UpdateViTriDto } from './dto/update-vi-tri.dto';
import { PhanTrangTimKiemDto } from './dto/phan-trang-tim-kiem.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { phanTrang } from 'src/common/helpers/pagination.helper';
import { buildSafeImageName } from 'src/common/helpers/upload.helper';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

@Injectable()
export class ViTriService {
  constructor(private prisma: PrismaService) {}

  //! POST /api/vi-tri — Tạo mới vị trí
  async create(createViTriDto: CreateViTriDto) {
    return this.prisma.viTriTb.create({
      data: createViTriDto,
    });
  }

  //! GET /api/vi-tri — Lấy toàn bộ vị trí (chưa bị xoá mềm)
  async findAll() {
    return this.prisma.viTriTb.findMany({
      where: { isDeleted: false },
    });
  }

  //! GET /api/vi-tri/phan-trang-tim-kiem — Phân trang + tìm kiếm theo tên vị trí
  async phanTrangTimKiem(query: PhanTrangTimKiemDto) {
    const keyword = query.keyword ?? '';

    return phanTrang(this.prisma.viTriTb, {
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
      where: {
        isDeleted: false,
        tenViTri: { contains: keyword }, 
      },
      orderBy: { id: 'desc' },
    });
  }

  //! GET /api/vi-tri/:id — Lấy chi tiết 1 vị trí theo id
  async findOne(id: number) {
    const viTri = await this.prisma.viTriTb.findUnique({
      where: { id },
    });
    if (!viTri || viTri.isDeleted) {
      throw new NotFoundException(`Không tìm thấy vị trí #${id}`);
    }
    return viTri;
  }

  //! PUT /api/vi-tri/:id — Cập nhật vị trí theo id
  async update(id: number, updateViTriDto: UpdateViTriDto) {
    await this.findOne(id);

    return this.prisma.viTriTb.update({
      where: { id },
      data: updateViTriDto,
    });
  }

  //! DELETE /api/vi-tri/:id — Xoá mềm vị trí (đánh dấu isDeleted)
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.viTriTb.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return { message: `Đã xoá vị trí #${id}` };
  }

  //! POST /api/vi-tri/upload-hinh-vitri?maViTri= — Upload hình cho vị trí
  async uploadHinhViTri(maViTri: number, file: any) {
    // Validate mimetype/size + sinh tên file an toàn (chặn path-traversal)
    const fileName = buildSafeImageName(file, maViTri, Date.now());

    await this.findOne(maViTri);

    const folder = join(process.cwd(), 'public', 'vi-tri');
    await mkdir(folder, { recursive: true }); // tạo thư mục nếu chưa có

    await writeFile(join(folder, fileName), file.buffer);

    const url = `/vi-tri/${fileName}`;
    await this.prisma.viTriTb.update({
      where: { id: maViTri },
      data: { hinhAnh: url },
    });

    return { message: 'Upload hình vị trí thành công', fileName, url };
  }
}
