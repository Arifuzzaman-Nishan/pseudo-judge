import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  async crawlProblems(@Body() dto: CrawlProblemsDto) {
    return this.problemService.crawlProblems(dto);
  }

  @Get('findall')
  async findAll() {
    return this.problemService.findAll();
  }

  @Get('findoneWithDetails/:problemId')
  async findOne(@Param('problemId') problemId: string) {
    return this.problemService.findOne(problemId);
  }
}
