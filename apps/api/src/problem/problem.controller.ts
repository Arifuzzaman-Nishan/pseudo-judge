import { Body, Controller, Post } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { DifficultyRating } from './schemas/problem.schema';

export type CrawlProblemsDto = {
  url: string;
  ojName: string;
  difficultyRating: DifficultyRating;
};

@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post('crawl')
  async crawlProblems(@Body() dto: any) {
    console.log('dto is ', dto);
    return this.problemService.crawlProblems(dto);
  }
}
