import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateViTriDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên vị trí không được để trống' })
  tenViTri!: string;

  @IsOptional()
  @IsString()
  tinhThanh?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'quocGia phải là số nguyên' })
  quocGia?: number;

  @IsOptional()
  @IsString()
  hinhAnh?: string;
}