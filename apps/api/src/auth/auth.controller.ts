import {
  Body,
  Controller,
  Get,
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

    const userInfo = JSON.stringify({
      userId: registerData._id,
      role: registerData.role,
    });

    res.cookie('userRole', userInfo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.send(registerData);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: Req, @Response() res: Res) {
    const loginData = this.authService.login(req.user);

    // console.log('loginData is ', loginData);
    res.cookie('auth', loginData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    const userInfo = JSON.stringify({
      userId: loginData._id,
      role: loginData.role,
    });

    res.cookie('userInfo', userInfo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.send(loginData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('isLogin')
  async isLogin(@Request() req: Req) {
    const user = req.user;
    const data = await this.authService.isLogin((user as any)._id);
    return data;
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Request() req: Req, @Response() res: Res) {
    // const user = req.user;
    res.clearCookie('auth', { httpOnly: true });
    res.clearCookie('userInfo', { httpOnly: true });
    res.send({ message: 'Logout Successful' });
  }
}
