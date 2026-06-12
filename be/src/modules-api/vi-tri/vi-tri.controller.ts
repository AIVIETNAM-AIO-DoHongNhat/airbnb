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
import { ViTriService } from './vi-tri.service';
import { CreateViTriDto } from './dto/create-vi-tri.dto';
import { UpdateViTriDto } from './dto/update-vi-tri.dto';
import { PhanTrangTimKiemDto } from './dto/phan-trang-tim-kiem.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { MAX_IMAGE_BYTES } from 'src/common/helpers/upload.helper';

@ApiTags('ViTri')
@Controller('vi-tri')
export class ViTriController {
  constructor(private readonly viTriService: ViTriService) {}

  //! POST /api/vi-tri — Tạo mới vị trí
  @Post()
  create(@Body() createViTriDto: CreateViTriDto) {
    return this.viTriService.create(createViTriDto);
  }

  //! GET /api/vi-tri — Lấy danh sách toàn bộ vị trí
  @Public()
  @Get()
  findAll() {
    return this.viTriService.findAll();
  }

  //! GET /api/vi-tri/phan-trang-tim-kiem — Phân trang + tìm kiếm
  @Public()
  @Get('phan-trang-tim-kiem')
  phanTrangTimKiem(@Query() query: PhanTrangTimKiemDto) {
    return this.viTriService.phanTrangTimKiem(query);
  }

  //! POST /api/vi-tri/upload-hinh-vitri?maViTri= — Upload hình cho vị trí
  @Post('upload-hinh-vitri')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { hinhViTri: { type: 'string', format: 'binary' } },
    },
  })
  
  @UseInterceptors(
    FileInterceptor('hinhViTri', { limits: { fileSize: MAX_IMAGE_BYTES } }),
  )
  uploadHinhViTri(
    @Query('maViTri', ParseIntPipe) maViTri: number,
    @UploadedFile() file: any,
  ) {
    return this.viTriService.uploadHinhViTri(maViTri, file);
  }

  //! GET /api/vi-tri/:id — Lấy chi tiết vị trí theo id
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.viTriService.findOne(id);
  }

  //! PUT /api/vi-tri/:id — Cập nhật vị trí theo id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateViTriDto: UpdateViTriDto,
  ) {
    return this.viTriService.update(id, updateViTriDto);
  }

  //! DELETE /api/vi-tri/:id — Xoá vị trí theo id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.viTriService.remove(id);
  }
}
