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
import { DatPhongService } from './dat-phong.service';
import { CreateDatPhongDto } from './dto/create-dat-phong.dto';
import { UpdateDatPhongDto } from './dto/update-dat-phong.dto';

@ApiTags('DatPhong')
@Controller('dat-phong')
export class DatPhongController {
  constructor(private readonly datPhongService: DatPhongService) {}

  //! POST /api/dat-phong — Tạo mới đặt phòng
  @Post()
  create(@Body() createDatPhongDto: CreateDatPhongDto) {
    return this.datPhongService.create(createDatPhongDto);
  }

  //! GET /api/dat-phong — Lấy danh sách toàn bộ đặt phòng
  @Get()
  findAll() {
    return this.datPhongService.findAll();
  }

  //! GET /api/dat-phong/lay-theo-nguoi-dung/:MaNguoiDung — Lấy đặt phòng theo người dùng
  @Get('lay-theo-nguoi-dung/:MaNguoiDung')
  layTheoNguoiDung(
    @Param('MaNguoiDung', ParseIntPipe) maNguoiDung: number,
  ) {
    return this.datPhongService.layTheoNguoiDung(maNguoiDung);
  }

  //! GET /api/dat-phong/:id — Lấy chi tiết đặt phòng theo id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.datPhongService.findOne(id);
  }

  //! PUT /api/dat-phong/:id — Cập nhật đặt phòng theo id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDatPhongDto: UpdateDatPhongDto,
  ) {
    return this.datPhongService.update(id, updateDatPhongDto);
  }

  //! DELETE /api/dat-phong/:id — Xoá đặt phòng theo id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.datPhongService.remove(id);
  }
}
