import { JWTModule } from '@/auth/jwt/jwt.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GroupModule } from '@/group/group.module';

@Module({
  imports: [UserModule, PassportModule, JWTModule, GroupModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
