import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi-dung.dto';
import { PhanTrangTimKiemDto } from './dto/phan-trang-tim-kiem.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { phanTrang } from 'src/common/helpers/pagination.helper';
import { buildSafeImageName } from 'src/common/helpers/upload.helper';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

@Injectable()
export class NguoiDungService {
  constructor(private prisma: PrismaService) {}

  //! POST /api/users — Tạo mới người dùng
  async create(createNguoiDungDto: CreateNguoiDungDto) {
    const { email, password, ...rest } = createNguoiDungDto;

    const existUser = await this.prisma.nguoiDungTb.findUnique({
      where: { email },
    });
    if (existUser) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hashed = bcrypt.hashSync(password, 10);

    return this.prisma.nguoiDungTb.create({
      data: { email, password: hashed, ...rest },
      omit: { password: true },
    });
  }

  //! GET /api/users — Lấy toàn bộ người dùng (chưa bị xoá mềm)
  async findAll() {
    return this.prisma.nguoiDungTb.findMany({
      where: { isDeleted: false },
      omit: { password: true },
    });
  }

  //! GET /api/users/phan-trang-tim-kiem — Phân trang + tìm kiếm theo tên
  async phanTrangTimKiem(query: PhanTrangTimKiemDto) {
    const keyword = query.keyword ?? '';

    return phanTrang(this.prisma.nguoiDungTb, {
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
      where: {
        isDeleted: false,
        name: { contains: keyword }, // tìm theo tên chứa từ khoá
      },
      omit: { password: true },
      orderBy: { id: 'desc' },
    });
  }

  //! GET /api/users/:id — Lấy chi tiết 1 người dùng theo id
  async findOne(id: number) {
    const user = await this.prisma.nguoiDungTb.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (!user || user.isDeleted) {
      throw new NotFoundException(`Không tìm thấy người dùng #${id}`);
    }
    return user;
  }

  //! PUT /api/users/:id — Cập nhật người dùng theo id
  async update(id: number, updateNguoiDungDto: UpdateNguoiDungDto) {
    await this.findOne(id);

    const data = { ...updateNguoiDungDto };
    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }

    return this.prisma.nguoiDungTb.update({
      where: { id },
      data,
      omit: { password: true },
    });
  }

  //! DELETE /api/users?id= — Xoá mềm người dùng (đánh dấu isDeleted)
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.nguoiDungTb.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return { message: `Đã xoá người dùng #${id}` };
  }

  //! GET /api/users/search/:TenNguoiDung — Tìm người dùng theo tên
  async searchByName(tenNguoiDung: string) {
    return this.prisma.nguoiDungTb.findMany({
      where: {
        isDeleted: false,
        name: { contains: tenNguoiDung },
      },
      omit: { password: true },
    });
  }

  //! POST /api/users/upload-avatar — Upload ảnh đại diện
  async uploadAvatar(userId: number, file: any) {
    // Validate mimetype/size + sinh tên file an toàn (chặn path-traversal)
    const fileName = buildSafeImageName(file, userId, Date.now());

    // Thư mục đích: public/avatars (đã được serve tĩnh trong main.ts)
    const folder = join(process.cwd(), 'public', 'avatars');
    await mkdir(folder, { recursive: true }); // tạo thư mục nếu chưa có
    await writeFile(join(folder, fileName), file.buffer);

    // Đường dẫn truy cập public (host phục vụ static từ thư mục /public)
    const url = `/avatars/${fileName}`;

    // Lưu URL avatar vào DB để các lần đọc user sau lấy được ảnh
    const user = await this.prisma.nguoiDungTb.update({
      where: { id: userId },
      data: { avatar: url },
      omit: { password: true },
    });

    return { message: 'Upload avatar thành công', url, user };
  }
}
