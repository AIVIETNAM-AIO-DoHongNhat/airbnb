import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateBinhLuanDto {
  // maCongViec = mã phòng được bình luận (FK -> PhongTb)
  @Type(() => Number)
  @IsInt({ message: 'maPhong phải là số nguyên' })
  @IsNotEmpty({ message: 'maPhong không được để trống' })
  maCongViec!: number;

  @Type(() => Number)
  @IsInt({ message: 'maNguoiBinhLuan phải là số nguyên' })
  @IsNotEmpty({ message: 'maNguoiBinhLuan không được để trống' })
  maNguoiBinhLuan!: number;

  @IsOptional()
  @IsString()
  noiDung?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'saoBinhLuan phải là số nguyên' })
  @Min(1, { message: 'saoBinhLuan tối thiểu là 1' })
  @Max(5, { message: 'saoBinhLuan tối đa là 5' })
  saoBinhLuan?: number;
}
