import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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

  @Post('create')
  async crawlProblems(@Body() dto: CrawlProblemsDto) {
    return this.problemService.crawlProblems(dto);
  }

  @Get('findall')
  async findAll() {
    return this.problemService.findAll();
  }

  @Get('findAllProblemsOrGroupProblems')
  async findAllProblemsOrGroupProblems(@Query('userId') userId: string) {
    return this.problemService.findAllProblemsOrGroupProblems(userId);
  }

  @Get('findoneWithDetails/:problemId')
  async findOne(@Param('problemId') problemId: string) {
    return this.problemService.findOne(problemId);
  }

  @Delete('delete/:problemId')
  async deleteProblem(@Param('problemId') problemId: string) {
    return this.problemService.deleteProblem(problemId);
  }

  @Get('findGroupProblems/:groupId')
  async findGroupProblems(@Param('groupId') groupId: string) {
    return this.problemService.findGroupProblems(groupId);
  }

  @Post('submitCode')
  async submitCode(@Body() dto: any) {
    return this.problemService.submitCode(dto);
  }

  @Post('solution/:runId')
  async solution(@Param('runId') runId: any) {
    return this.problemService.solution(runId);
  }

  // problem submission operations
  @Get('findProblemSubmissions/:userId')
  async findProblemSubmissions(
    @Param('userId') userId: string,
    @Query() query: { problemId?: string; groupId: string },
  ) {
    return this.problemService.findProblemSubmissions({
      userId,
      query,
    });
  }
}
