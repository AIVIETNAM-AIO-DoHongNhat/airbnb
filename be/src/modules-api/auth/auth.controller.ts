import { Body, Controller, Get, Post, Put, Req, Res } from '@nestjs/common';
import type { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { User } from 'src/common/decorator/user.decorator';

const ACCESS_MAX_AGE = 60 * 60 * 1000; // 1 giờ
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 ngày

// Cookie cross-origin (FE :3000 <-> BE :3099). Trên localhost dùng sameSite=lax,
// production (HTTPS) cần secure + sameSite=none.
function cookieOptions(maxAge?: number): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge,
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async signup(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(body);

    res.cookie('accessToken', accessToken, cookieOptions(ACCESS_MAX_AGE));
    res.cookie('refreshToken', refreshToken, cookieOptions(REFRESH_MAX_AGE));

    return { user, accessToken };
  }

  @Public()
  @Post('login')
  async signin(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(body);

    // Lưu token vào cookie httpOnly (ProtectGuard đọc req.cookies.accessToken)
    res.cookie('accessToken', accessToken, cookieOptions(ACCESS_MAX_AGE));
    res.cookie('refreshToken', refreshToken, cookieOptions(REFRESH_MAX_AGE));

    return { user, accessToken };
  }

  @Public()
  @Post('refresh-token')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.refreshToken(req);

    res.cookie('accessToken', accessToken, cookieOptions(ACCESS_MAX_AGE));
    res.cookie('refreshToken', refreshToken, cookieOptions(REFRESH_MAX_AGE));

    return { accessToken };
  }

  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // clearCookie cần cùng options (httpOnly/sameSite/secure) để xoá đúng cookie
    res.clearCookie('accessToken', cookieOptions());
    res.clearCookie('refreshToken', cookieOptions());
    return { message: 'Đăng xuất thành công' };
  }

  // Lấy thông tin user hiện tại từ cookie (để FE rehydrate sau khi reload)
  @Get('me')
  me(@User() user: { password?: string }) {
    const { password: _password, ...rest } = user;
    return rest;
  }

  @Put('profile')
  updateProfile(
    @User() user: { id: number },
    @Body() body: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user.id, body);
  }
}
