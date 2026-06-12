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
import { PhongService } from './phong.service';
import { CreatePhongDto } from './dto/create-phong.dto';
import { UpdatePhongDto } from './dto/update-phong.dto';
import { PhanTrangTimKiemDto } from './dto/phan-trang-tim-kiem.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { MAX_IMAGE_BYTES } from 'src/common/helpers/upload.helper';

@ApiTags('Phong')
@Controller('phong-thue')
export class PhongController {
  constructor(private readonly phongService: PhongService) {}

  //! POST /api/phong-thue — Tạo mới phòng
  @Post()
  create(@Body() createPhongDto: CreatePhongDto) {
    return this.phongService.create(createPhongDto);
  }

  //! GET /api/phong-thue — Lấy danh sách toàn bộ phòng
  @Public()
  @Get()
  findAll() {
    return this.phongService.findAll();
  }

  //! GET /api/phong-thue/lay-phong-theo-vi-tri?maViTri= — Lấy phòng theo vị trí
  @Public()
  @Get('lay-phong-theo-vi-tri')
  layPhongTheoViTri(@Query('maViTri', ParseIntPipe) maViTri: number) {
    return this.phongService.layPhongTheoViTri(maViTri);
  }

  //! GET /api/phong-thue/phan-trang-tim-kiem — Phân trang + tìm kiếm
  @Public()
  @Get('phan-trang-tim-kiem')
  phanTrangTimKiem(@Query() query: PhanTrangTimKiemDto) {
    return this.phongService.phanTrangTimKiem(query);
  }

  //! POST /api/phong-thue/upload-hinh-phong?maPhong= — Upload hình cho phòng
  @Post('upload-hinh-phong')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { hinhPhong: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('hinhPhong', { limits: { fileSize: MAX_IMAGE_BYTES } }),
  )
  uploadHinhPhong(
    @Query('maPhong', ParseIntPipe) maPhong: number,
    @UploadedFile() file: any,
  ) {
    return this.phongService.uploadHinhPhong(maPhong, file);
  }

  //! GET /api/phong-thue/:id — Lấy chi tiết phòng theo id
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.phongService.findOne(id);
  }

  //! PUT /api/phong-thue/:id — Cập nhật phòng theo id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePhongDto: UpdatePhongDto,
  ) {
    return this.phongService.update(id, updatePhongDto);
  }

  //! DELETE /api/phong-thue/:id — Xoá phòng theo id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.phongService.remove(id);
  }
}
