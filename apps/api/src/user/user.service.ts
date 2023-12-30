import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

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
    const newUser = (
      await this.userRepository.create({
        ...restdto,
        password: passwordHash,
      })
    ).toObject({
      versionKey: false,
    });

    return {
      msg: 'User created successfully',
      ...newUser,
    };
  }
}
