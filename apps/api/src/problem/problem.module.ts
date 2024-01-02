import { Module } from '@nestjs/common';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { PuppeteerService } from 'src/utils/puppeteer/puppeteer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Problem, ProblemSchema } from './schemas/problem.schema';
import {
  ProblemDetail,
  ProblemDetailsSchema,
} from './schemas/problemDetails.schema';
import { ProblemRepository } from './repositories/problem.repository';
import { ProblemDetailsRepository } from './repositories/problemDetails.repository';
import { VjudgeService } from '@/utils/vjudge/vjudge.service';
import { UserModule } from '@/user/user.module';
import {
  ProblemSubmission,
  ProblemSubmissionSchema,
} from './schemas/problemSubmission.schema';
import { ProblemSubmissionRepository } from './repositories/problemSubmission.repository';
import { GroupModule } from '@/group/group.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Problem.name,
        schema: ProblemSchema,
      },
      {
        name: ProblemDetail.name,
        schema: ProblemDetailsSchema,
      },
      {
        name: ProblemSubmission.name,
        schema: ProblemSubmissionSchema,
      },
    ]),
    UserModule,
    GroupModule,
  ],
  controllers: [ProblemController],
  providers: [
    ProblemService,
    PuppeteerService,
    VjudgeService,
    ProblemRepository,
    ProblemDetailsRepository,
    ProblemSubmissionRepository,
  ],
})
export class ProblemsModule {}
