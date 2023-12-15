import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { PuppeteerService } from 'src/utils/puppeteer/puppeteer.service';
import { CrawlProblemsDto } from './problems.controller';

export enum OJName {
  TIMUS = 'timus',
  CODEFORCES = 'codeforces',
  UVA = 'uva',
  SPOJ = 'spoj',
  LOJ = 'lightoj',
}

@Injectable()
export class ProblemsService {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  async timus(page: Page) {
    const titleSelector =
      'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div.problem_content > h2';
    const timelimitSelector =
      'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div.problem_content > div.problem_limits';
    // const memorylimitSelector = '';
    const problemDescriptionSelector = '#problem_text > div:nth-child(1) > div';
    const inputDescriptionSelector = '#problem_text > div:nth-child(3) > div';
    const outputDescriptionSelector = '#problem_text > div:nth-child(5) > div';
    const sampleInputSelector =
      '#problem_text > table > tbody > tr:nth-child(2) > td:nth-child(1) > pre';
    const sampleOutputSelector =
      '#problem_text > table > tbody > tr:nth-child(2) > td:nth-child(2) > pre';

    const title = await this.puppeteerService.evaluate(page, titleSelector);
    const timelimit = await this.puppeteerService.evaluate(
      page,
      timelimitSelector,
    );
    // const memorylimit = await this.puppeteerService.evaluate(
    //   page,
    //   memorylimitSelector,
    // );
    const problemDescription = await this.puppeteerService.evaluate(
      page,
      problemDescriptionSelector,
    );

    const inputDescription = await this.puppeteerService.evaluate(
      page,
      inputDescriptionSelector,
    );
    const outputDescription = await this.puppeteerService.evaluate(
      page,
      outputDescriptionSelector,
    );
    const sampleInput = await this.puppeteerService.evaluate(
      page,
      sampleInputSelector,
    );
    const sampleOutput = await this.puppeteerService.evaluate(
      page,
      sampleOutputSelector,
    );

    console.log(
      title,
      timelimit,
      problemDescription,
      inputDescription,
      outputDescription,
      sampleInput,
      sampleOutput,
    );
  }

  async lightOj(page: Page) {
    const titleSelector = '#leftSection > div > div.title.ml-3 > p';
    const timelimitSelector =
      '#leftSection > div > div.columns.pt-1.ml-4.mb-4.no-print > div.is-5.limit-section.mr-6 > div:nth-child(1) > div.tooltip-trigger > span';

    const memorylimitSelector =
      '#leftSection > div > div.columns.pt-1.ml-4.mb-4.no-print > div.is-5.limit-section.mr-6 > div:nth-child(2) > div.tooltip-trigger > span';

    const problemDescriptionSelector =
      'div > div > div.card-body > div > div:nth-child(1) > div';

    const inputDescriptionSelector =
      'div > div > div.card-body > div > div:nth-child(2) > div';

    const outputDescriptionSelector =
      'div > div > div.card-body > div > div:nth-child(3) > div';

    const sampleInputSelector =
      'div > div > div.card-body > div > div:nth-child(4) > div > div > div > table > tbody > tr > td:nth-child(1) > div > div > p';

    const sampleOutputSelector =
      'div > div > div.card-body > div > div:nth-child(4) > div > div > div > table > tbody > tr > td:nth-child(2) > div > div > p';

    const title = await this.puppeteerService.evaluate(page, titleSelector);
    const timelimit = await this.puppeteerService.evaluate(
      page,
      timelimitSelector,
    );
    const memorylimit = await this.puppeteerService.evaluate(
      page,
      memorylimitSelector,
    );
    const problemDescription = await this.puppeteerService.evaluate(
      page,
      problemDescriptionSelector,
    );

    const inputDescription = await this.puppeteerService.evaluate(
      page,
      inputDescriptionSelector,
    );
    const outputDescription = await this.puppeteerService.evaluate(
      page,
      outputDescriptionSelector,
    );
    const sampleInput = await this.puppeteerService.evaluate(
      page,
      sampleInputSelector,
    );
    const sampleOutput = await this.puppeteerService.evaluate(
      page,
      sampleOutputSelector,
    );

    console.log(
      title,
      timelimit,
      memorylimit,
      problemDescription,
      inputDescription,
      outputDescription,
      sampleInput,
      sampleOutput,
    );
  }

  async crawlProblems(dto: CrawlProblemsDto) {
    const { url, ojname } = dto;

    console.log('hello from crawlProblems');
    const browser = await this.puppeteerService.launch();
    const page = await this.puppeteerService.newPage(browser);
    await this.puppeteerService.goto(page, url);

    switch (ojname) {
      case OJName.TIMUS:
        await this.timus(page);
        break;
      case OJName.LOJ:
        await this.lightOj(page);
        break;
      default:
        console.log('nothing....');
    }
  }
}
