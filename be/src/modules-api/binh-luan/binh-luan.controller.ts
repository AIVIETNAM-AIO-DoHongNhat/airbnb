import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BinhLuanService } from './binh-luan.service';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';
import { UpdateBinhLuanDto } from './dto/update-binh-luan.dto';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('BinhLuan')
@Controller('binh-luan')
export class BinhLuanController {
  constructor(private readonly binhLuanService: BinhLuanService) {}

  //! POST /api/binh-luan — Tạo mới bình luận
  @Post()
  create(@Body() createBinhLuanDto: CreateBinhLuanDto) {
    return this.binhLuanService.create(createBinhLuanDto);
  }

  //! GET /api/binh-luan — Lấy danh sách toàn bộ bình luận
  @Public()
  @Get()
  findAll() {
    return this.binhLuanService.findAll();
  }

  //! GET /api/binh-luan/lay-binh-luan-theo-phong/:MaPhong — Lấy bình luận theo phòng
  @Public()
  @Get('lay-binh-luan-theo-phong/:MaPhong')
  layBinhLuanTheoPhong(@Param('MaPhong', ParseIntPipe) maPhong: number) {
    return this.binhLuanService.layBinhLuanTheoPhong(maPhong);
  }

  //! PUT /api/binh-luan/:id — Cập nhật bình luận theo id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBinhLuanDto: UpdateBinhLuanDto,
  ) {
    return this.binhLuanService.update(id, updateBinhLuanDto);
  }

  //! DELETE /api/binh-luan/:id — Xoá bình luận theo id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.binhLuanService.remove(id);
  }
}
