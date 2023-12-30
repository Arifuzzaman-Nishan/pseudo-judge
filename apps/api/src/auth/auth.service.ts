import { JWTService } from '@/auth/jwt/jwt.service';
import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JWTService,
    private readonly userService: UserService,
  ) {}

  async register(dto: any) {
    const newUser = await this.userService.createUser(dto);

    const payload = {
      userId: newUser._id as unknown as string,
      username: newUser.username,
      email: newUser.email,
    };

    delete newUser.password;

    return {
      ...newUser,
      ...this.jwtService.jwtToken(payload),
      msg: 'User registered successfully',
    };
  }

  login(dto: any) {
    const payload = {
      userId: dto._id as unknown as string,
      username: dto.username,
      email: dto.email,
    };

    return {
      ...dto,
      ...this.jwtService.jwtToken(payload),
      msg: 'User logged in successfully',
    };
  }

  async validateUser(email: string, password: string) {
    const user = (
      await this.userRepository.findOne({
        email,
      })
    ).toObject({
      versionKey: false,
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }
}
