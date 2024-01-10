import { JWTService } from '@/auth/jwt/jwt.service';
import { GroupRepository } from '@/group/group.repository';
import { UserRepository } from '@/user/user.repository';
import { UserRole } from '@/user/user.schema';
import { UserService } from '@/user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JWTService,
    private readonly userService: UserService,
    private readonly groupRepository: GroupRepository,
  ) {}

  async register(dto: any) {
    const newUser = await this.userService.createUser(dto);

    const payload = {
      userId: newUser._id as unknown as string,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role as UserRole,
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
      role: dto.role as UserRole,
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

  async isLogin(userId: string) {
    const user = (
      await this.userRepository.findOne(
        {
          _id: userId,
        },
        {
          password: 0,
          __v: 0,
        },
      )
    ).toObject();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const group = await this.groupRepository.findOne({
      users: {
        $in: [new mongoose.Types.ObjectId(userId)],
      },
    });

    // Check if group is not null before calling toObject
    const groupObject = group ? group.toObject() : null;
    const isUserInGroup = groupObject != null;

    return {
      groupId: isUserInGroup ? groupObject._id : null,
      isUserInGroup,
      ...user,
    };
  }
}
