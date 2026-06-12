import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } from 'src/common/constant/app.constant';

@Injectable()
export class TokenService {
  //! CREATE ACCESSTOKEN
  createAccessToken(userId) {
    if (!userId) {
      throw new BadRequestException('Không có userId để tạo token');
    }

    const accessToken = jwt.sign(
      { userId: userId },
      ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES,
      } as jwt.SignOptions,
    );
    return accessToken;
  }
  //! VERIFY ACCESSTOKEN
  verifyAccessToken(accessToken, option?: jwt.VerifyOptions) {
    const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET as string, option);
    return decode;
  }
  //! CREATE REFRESHTOKEN
  createRefreshToken(userId) {
    if (!userId) {
      throw new BadRequestException('Không có userId để tạo token');
    }
    const refreshToken = jwt.sign(
      { userId: userId },
      REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES,
      } as jwt.SignOptions,
    );
    return refreshToken;
  }
  //! VERIFY refreshToken
  verifyRefreshToken(refreshToken, option?: jwt.VerifyOptions) {
    const decode = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string, option);
    return decode;
  }
}
