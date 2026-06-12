import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateDatPhongDto {
  @Type(() => Number)
  @IsInt({ message: 'maPhong phải là số nguyên' })
  @IsNotEmpty({ message: 'maPhong không được để trống' })
  maPhong!: number;

  @IsDateString({}, { message: 'ngayDen phải là ngày hợp lệ (ISO-8601)' })
  @IsNotEmpty({ message: 'ngayDen không được để trống' })
  ngayDen!: string;

  @IsDateString({}, { message: 'ngayDi phải là ngày hợp lệ (ISO-8601)' })
  @IsNotEmpty({ message: 'ngayDi không được để trống' })
  ngayDi!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'soLuongKhach phải là số nguyên' })
  @Min(1, { message: 'soLuongKhach tối thiểu là 1' })
  soLuongKhach?: number;

  @Type(() => Number)
  @IsInt({ message: 'maNguoiDat phải là số nguyên' })
  @IsNotEmpty({ message: 'maNguoiDat không được để trống' })
  maNguoiDat!: number;
}