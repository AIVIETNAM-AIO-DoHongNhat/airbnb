import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { TokenService } from 'src/modules-system/token/token.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private tokenService: TokenService) {}
  //! Login method
  async login(body: LoginDto) {
    const { email, password } = body;
    const userExist = await this.prisma.nguoiDungTb.findUnique({
      where: {
        email,
      },
    });
    if (!userExist) {
      throw new BadRequestException(
        'Người dùng chưa tồn tại, vui lòng đăng ký!',
      );
    }

    const isPassword = bcrypt.compareSync(password, userExist.password);
    if(!isPassword){
      throw new UnauthorizedException("Mật khẩu không chính xác");
    }

    const accessToken = this.tokenService.createAccessToken(userExist.id);
    const refreshToken = this.tokenService.createRefreshToken(userExist.id);

    const { password: _password, ...user } = userExist;

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
  //! REFRESH TOKEN
  async refreshToken(req: Request){
    const {accessToken, refreshToken} = req.cookies;

    if(!accessToken){
      throw new UnauthorizedException("Không có accessToken để kiểm tra");
    }

    if (!refreshToken) {
      throw new UnauthorizedException('Không có refreshToken để kiểm tra');
    }

    const decodeAccessToken: any = this.tokenService.verifyAccessToken(
      accessToken,
      {
        ignoreExpiration: true,
      },
    );

    let isRefreshTokenExpired = false;
    let decodeRefreshToken;
    try{
      decodeRefreshToken = this.tokenService.verifyRefreshToken(refreshToken);
    } catch(error){
      if(error.name === 'TokenExpiredError'){
        isRefreshTokenExpired = true;
        decodeRefreshToken = this.tokenService.verifyRefreshToken(refreshToken, {
          ignoreExpiration: true,
        });
      }else{
        throw new UnauthorizedException("refreshToken không hợp lệ");
      }
    }

    if (decodeAccessToken.userId !== decodeRefreshToken.userId) {
      throw new UnauthorizedException('Token không hợp lệ');
    };

    const userExits = await this.prisma.nguoiDungTb.findUnique({
      where: {
        id: decodeAccessToken.userId,
      }
    })

    if(!userExits){
      throw new UnauthorizedException("Người dùng không tồn tại");
    }

    const newAccessToken = this.tokenService.createAccessToken(userExits.id);
    if(isRefreshTokenExpired){
      const newRefreshToken = this.tokenService.createRefreshToken(userExits.id);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }
    }

    return {
      accessToken: newAccessToken, 
      refreshToken: refreshToken,
    }
  };
  //! REGISTER
  async register(body: RegisterDto){
    const {email, password, gender, phone, birthday, name} = body;
    const userExist = await this.prisma.nguoiDungTb.findUnique({
      where: {
        email,
      }
    });

    if(userExist){
      throw new BadRequestException("Người dùng đã tồn tại, vui lòng đăng nhập hoặc sử dụng tài khoản khác");
    }else{
      const encodePassword = bcrypt.hashSync(password, 10);
      await this.prisma.nguoiDungTb.create({
        data: {
          email,
          password: encodePassword,
          gender,
          phone,
          birthday,
          name,
        }
      })
    }
    const newUser = await this.prisma.nguoiDungTb.findUnique({
      where: {
        email,
      }
    });
    if(!newUser){
      throw new BadRequestException("Người dùng không tồn tại")
    }
    const accessToken = this.tokenService.createAccessToken(newUser.id);
    const refreshToken = this.tokenService.createRefreshToken(newUser.id);

    const { password: _password, ...user } = newUser;

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async updateProfile(userId: number, body: UpdateProfileDto) {
    const updated = await this.prisma.nguoiDungTb.update({
      where: { id: userId },
      data: body,
      omit: { password: true },
    });
    return updated;
  }
}
