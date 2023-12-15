import { Module } from '@nestjs/common';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { PuppeteerService } from 'src/utils/puppeteer/puppeteer.service';

@Module({
  imports: [],
  controllers: [ProblemsController],
  providers: [ProblemsService, PuppeteerService],
})
export class ProblemsModule {}
