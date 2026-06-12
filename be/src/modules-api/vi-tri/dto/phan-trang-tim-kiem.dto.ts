import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

// DTO dùng cho GET /api/vi-tri/phan-trang-tim-kiem — query phân trang + tìm kiếm
export class PhanTrangTimKiemDto {
  // Trang hiện tại (bắt đầu từ 1). @Type để ép query string -> number
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'pageIndex phải là số nguyên' })
  @Min(1, { message: 'pageIndex tối thiểu là 1' })
  pageIndex?: number = 1;

  // Số bản ghi mỗi trang
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'pageSize phải là số nguyên' })
  @Min(1, { message: 'pageSize tối thiểu là 1' })
  pageSize?: number = 10;

  // Từ khoá tìm kiếm theo tên vị trí (có thể bỏ trống)
  @IsOptional()
  @IsString()
  keyword?: string = '';
}