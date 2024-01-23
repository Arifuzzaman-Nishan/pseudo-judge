import { Module } from '@nestjs/common';
import { CutoffService } from './cutoff.service';
import { ScheduleModule } from '@nestjs/schedule';
import { GroupModule } from '@/group/group.module';
import { ProblemsModule } from '@/problem/problem.module';

@Module({
  imports: [ScheduleModule.forRoot(), GroupModule, ProblemsModule],
  providers: [CutoffService],
})
export class CutoffModule {}
