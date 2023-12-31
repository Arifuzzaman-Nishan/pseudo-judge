import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from './jwt.service';
import { JWTStrategy } from '../strategies/jwt.strategy';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [JWTService, JWTStrategy],
  exports: [JWTService],
})
export class JWTModule {}
