import { UserRole } from '@/user/user.schema';
import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTService {
  constructor(private readonly jwtService: JwtService) {}

  jwtToken(userData: {
    userId: string;
    username: string;
    email: string;
    role: UserRole;
  }) {
    const payload = userData;

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
