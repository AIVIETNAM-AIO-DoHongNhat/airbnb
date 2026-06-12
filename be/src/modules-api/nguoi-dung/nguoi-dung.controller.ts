import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NguoiDungService } from './nguoi-dung.service';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi-dung.dto';
import { PhanTrangTimKiemDto } from './dto/phan-trang-tim-kiem.dto';
import { User } from 'src/common/decorator/user.decorator';
import { MAX_IMAGE_BYTES } from 'src/common/helpers/upload.helper';

@ApiTags('NguoiDung')
@Controller('users')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) {}

  //! POST /api/users — Tạo mới người dùng
  @Post()
  create(@Body() createNguoiDungDto: CreateNguoiDungDto) {
    return this.nguoiDungService.create(createNguoiDungDto);
  }

  //! GET /api/users — Lấy danh sách toàn bộ người dùng
  @Get()
  findAll() {
    return this.nguoiDungService.findAll();
  }

  //! DELETE /api/users?id= — Xoá người dùng (id truyền qua query string)
  @Delete()
  remove(@Query('id', ParseIntPipe) id: number) {
    return this.nguoiDungService.remove(id);
  }

  //! GET /api/users/phan-trang-tim-kiem — Phân trang + tìm kiếm
  @Get('phan-trang-tim-kiem')
  phanTrangTimKiem(@Query() query: PhanTrangTimKiemDto) {
    return this.nguoiDungService.phanTrangTimKiem(query);
  }

  //! GET /api/users/:id — Lấy chi tiết người dùng theo id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.nguoiDungService.findOne(id);
  }

  //! PUT /api/users/:id — Cập nhật người dùng theo id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNguoiDungDto: UpdateNguoiDungDto,
  ) {
    return this.nguoiDungService.update(id, updateNguoiDungDto);
  }

  //! GET /api/users/search/:TenNguoiDung — Tìm người dùng theo tên
  @Get('search/:TenNguoiDung')
  searchByName(@Param('TenNguoiDung') tenNguoiDung: string) {
    return this.nguoiDungService.searchByName(tenNguoiDung);
  }

  //! POST /api/users/upload-avatar — Upload ảnh đại diện của user đang đăng nhập
  @Post('upload-avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { avatar: { type: 'string', format: 'binary' } },
    },
  })
  // FileInterceptor bắt field 'avatar' trong form-data (lưu tạm trong memory)
  @UseInterceptors(
    FileInterceptor('avatar', { limits: { fileSize: MAX_IMAGE_BYTES } }),
  )
  uploadAvatar(
    // @User lấy user đã được ProtectGuard gắn vào req.user sau khi xác thực token
    @User() user: { id: number },
    @UploadedFile() file: any,
  ) {
    return this.nguoiDungService.uploadAvatar(user.id, file);
  }
}
