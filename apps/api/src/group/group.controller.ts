import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Post,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  create(@Body() dto: any) {
    return this.groupService.createGroup(dto);
  }

  @Get('findall')
  findAll(@Query('enrollmentKey', ParseBoolPipe) enrollmentKey: boolean) {
    return this.groupService.findAllGroups(enrollmentKey);
  }

  @Get('findone/:id')
  findOne(@Param('id') id: string) {
    return this.groupService.findGroupById(id);
  }

  @Delete('delete/:groupId')
  delete(@Param('groupId') groupId: string) {
    return this.groupService.deleteGroup(groupId);
  }

  @Get('findGroupAddedProblems/:groupId')
  findGroupProblems(@Param('groupId') groupId: string) {
    return this.groupService.findGroupAddedProblems(groupId);
  }

  @Get('findGroupNotAddedProblems/:groupId')
  findGroupNotAddedProblems(@Param('groupId') groupId: string) {
    return this.groupService.findGroupNotAddedProblems(groupId);
  }

  @Post('addProblemsToGroup')
  addProblems(@Body() dto: any) {
    return this.groupService.problemsAddedIntoGroup(dto);
  }

  @Post('removeProblemFromGroup')
  removeProblem(@Body() dto: any) {
    return this.groupService.removeProblemFromGroup(dto);
  }

  // user operations
  @Post('addUsersToGroup')
  addUsers(@Body() dto: any) {
    return this.groupService.usersAddedIntoGroup(dto);
  }

  @Post('removeUserFromGroup')
  removeUser(@Body() dto: any) {
    return this.groupService.removeUserFromGroup(dto);
  }

  @Get('findGroupAddedUsers/:groupId')
  findGroupUsers(@Param('groupId') groupId: string) {
    return this.groupService.findGroupAddedUsers(groupId);
  }

  @Get('findGroupNotAddedUsers/:groupId')
  findGroupNotAddedUsers(@Param('groupId') groupId: string) {
    return this.groupService.findGroupNotAddedUsers(groupId);
  }

  // enrollment key operations
  @Post('enrollUserToGroup')
  enrollUser(@Body() dto: any) {
    return this.groupService.enrollUserToGroup(dto);
  }

  @Get('findAllGroupProblems/:userId')
  findAllGroupProblems(@Param('userId') userId: string) {
    return this.groupService.findAllGroupProblemsByUserId(userId);
  }
}
