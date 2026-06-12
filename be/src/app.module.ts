import { Module } from '@nestjs/common';
import { AuthModule } from './modules-api/auth/auth.module';
import { BinhLuanModule } from './modules-api/binh-luan/binh-luan.module';
import { DatPhongModule } from './modules-api/dat-phong/dat-phong.module';
import { NguoiDungModule } from './modules-api/nguoi-dung/nguoi-dung.module';
import { PhongModule } from './modules-api/phong/phong.module';
import { ViTriModule } from './modules-api/vi-tri/vi-tri.module';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { TokenModule } from './modules-system/token/token.module';
import { APP_GUARD } from '@nestjs/core';
import { ProtectGuard } from './common/guard/protect.guard';

@Module({
  imports: [PrismaModule, TokenModule, AuthModule, BinhLuanModule, DatPhongModule, NguoiDungModule, PhongModule, ViTriModule],
  providers: [{provide: APP_GUARD, useClass: ProtectGuard}],
})
export class AppModule {}
