import { Module, forwardRef } from '@nestjs/common';
import { CutoffService } from './cutoff.service';
import { ScheduleModule } from '@nestjs/schedule';
import { GroupModule } from '@/group/group.module';
import { ProblemsModule } from '@/problem/problem.module';
import { CutoffHelperService } from './cutoffhelper.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => ProblemsModule),
    forwardRef(() => GroupModule),
  ],
  providers: [CutoffService, CutoffHelperService],
  exports: [CutoffHelperService],
})
export class CutoffModule {}
