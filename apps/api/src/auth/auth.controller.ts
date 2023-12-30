import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request as Req, Response as Res } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: any, @Response() res: Res) {
    const registerData = await this.authService.register(dto);
    res.cookie('auth', registerData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.send(registerData);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: Req, @Response() res: Res) {
    const loginData = this.authService.login(req.user);

    res.cookie('auth', loginData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.send(loginData);
  }
}
