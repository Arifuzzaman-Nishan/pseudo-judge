import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('findone/:username')
  findOneByUsername(@Param('username') username: string) {
    return this.userService.findOneByUsername(username);
  }

  @Get('rankings')
  findRankings(@Query('search') search: string) {
    return this.userService.findRankings(search);
  }

  @Get('findAcceptedProblems/:userId')
  findAcceptedProblems(@Param('userId') userId: string) {
    return this.userService.findUserAcceptedSubmissions(userId);
  }
}
