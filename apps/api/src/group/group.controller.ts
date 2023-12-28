import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  create(@Body() dto: any) {
    return this.groupService.createGroup(dto);
  }

  @Get('findall')
  findAll() {
    return this.groupService.findAllGroups();
  }

  @Get('findone/:id')
  findOne(@Param('id') id: string) {
    return this.groupService.findGroupById(id);
  }

  @Post('add-problems')
  addProblems(@Body() dto: any) {
    return this.groupService.problemsAddedIntoGroup(dto);
  }
}
