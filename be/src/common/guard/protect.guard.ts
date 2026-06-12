import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { TokenService } from 'src/modules-system/token/token.service';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class ProtectGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      // Kiểm tra xem route này có được đánh dấu là @Public() không
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      // Nếu là public thì cho đi qua luôn, không cần check token
      if (isPublic) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      // Để lấy được cookies bắt buộc phải tích hợp thư viện cookie-parser
      const { accessToken } = req.cookies;

      // Kiểm tra token
      if (!accessToken) {
        throw new UnauthorizedException('Not found token');
      }

      const decode = this.tokenService.verifyAccessToken(accessToken as string);
      // Kiểm tra token có trong DB hay không (và chưa bị xoá mềm)
      const userExits = await this.prisma.nguoiDungTb.findUnique({
        where: {
          id: (decode as any).userId,
        },
      });

      if (!userExits || userExits.isDeleted) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }

      req.user = userExits;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('jwt expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Token không hợp lệ');
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Lỗi không lường trước (vd kết nối DB) — không che giấu thành 401
      throw error;
    }
  }
}
