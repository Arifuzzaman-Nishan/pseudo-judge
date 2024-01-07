import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import gravatar from 'gravatar';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: any) {
    const { password, confirmPassword, ...restdto } = dto;

    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const userExists = await this.userRepository.findOne({
      email: dto.email,
    });

    if (userExists) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const imageUrl = gravatar.url(dto.email, {
      protocol: 'https',
      s: '70',
    });

    console.log('imageUrl is ', imageUrl);

    const newUser = (
      await this.userRepository.create({
        ...restdto,
        password: passwordHash,
        imageUrl,
      })
    ).toObject({
      versionKey: false,
    });

    return {
      msg: 'User created successfully',
      ...newUser,
    };
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOne(
      {
        username,
      },
      {
        password: 0,
        __v: 0,
      },
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
