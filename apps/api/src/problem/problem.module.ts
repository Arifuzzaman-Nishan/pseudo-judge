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
    ]),
  ],
  controllers: [ProblemController],
  providers: [
    ProblemService,
    PuppeteerService,
    VjudgeService,
    ProblemRepository,
    ProblemDetailsRepository,
  ],
})
export class ProblemsModule {}
