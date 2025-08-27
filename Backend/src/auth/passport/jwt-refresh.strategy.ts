import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

import { Request } from 'express';
import { JwtPayload, ResponseJwtPayload } from '@/common/types/payloads';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.body?.refresh_token,
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'), // 👈 cần đặt trong .env
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtPayload
  ): Promise<ResponseJwtPayload> {
    const body = req.body as { refresh_token?: string };
    const refreshToken = body.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    // check refreshToken trong Redis
    await this.authService.validateRefreshToken(payload.sub, refreshToken);

    // req.user = payload
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
