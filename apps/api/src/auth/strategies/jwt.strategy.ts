import { UserRepository } from '@/user/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    const extractJWTFromCookie = (req: Request) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['auth'];
      }
      return token;
    };

    super({
      jwtFromRequest: extractJWTFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const { email } = payload;
    const user = await this.userRepository.findOne(
      { email },
      {
        password: false,
      },
    );

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
