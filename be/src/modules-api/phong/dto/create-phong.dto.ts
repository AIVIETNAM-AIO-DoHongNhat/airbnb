import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePhongDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên phòng không được để trống' })
  tenPhong!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'khach phải là số nguyên' })
  @Min(1, { message: 'khach tối thiểu là 1' })
  khach?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'phongNgu phải là số nguyên' })
  @Min(0)
  phongNgu?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'giuong phải là số nguyên' })
  @Min(0)
  giuong?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'phongTam phải là số nguyên' })
  @Min(0)
  phongTam?: number;

  @IsOptional()
  @IsString()
  moTa?: string;

  @Type(() => Number)
  @IsInt({ message: 'giaTien phải là số nguyên' })
  @Min(0, { message: 'giaTien không được âm' })
  giaTien!: number;

  @IsOptional()
  @IsBoolean()
  mayGiat?: boolean;

  @IsOptional()
  @IsBoolean()
  banLa?: boolean;

  @IsOptional()
  @IsBoolean()
  tiVi?: boolean;

  @IsOptional()
  @IsBoolean()
  dieuHoa?: boolean;

  @IsOptional()
  @IsBoolean()
  wifi?: boolean;

  @IsOptional()
  @IsBoolean()
  bep?: boolean;

  @IsOptional()
  @IsBoolean()
  doXe?: boolean;

  @IsOptional()
  @IsBoolean()
  hoBoi?: boolean;

  @IsOptional()
  @IsBoolean()
  banUi?: boolean;

  @IsOptional()
  @IsString()
  hinhAnh?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'viTri phải là số nguyên' })
  viTri?: number;
}