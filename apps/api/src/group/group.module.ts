import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './group.schema';
import { GroupRepository } from './group.repository';
import { GroupHelperService } from './utils/groupHelper.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    UserModule,
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository, GroupHelperService],
})
export class GroupModule {}
