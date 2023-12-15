import { Body, Controller, Post } from '@nestjs/common';
import { ProblemsService } from './problems.service';

export type CrawlProblemsDto = {
  url: string;
  ojname: string;
};

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post('crawl')
  async crawlProblems(@Body() dto: CrawlProblemsDto) {
    return this.problemsService.crawlProblems(dto);
  }
}
