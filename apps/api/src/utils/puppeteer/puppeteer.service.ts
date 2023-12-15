import { Injectable } from '@nestjs/common';
import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

@Injectable()
export class PuppeteerService {
  async launch() {
    return await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
  }

  async newPage(browser: Browser) {
    return await browser.newPage();
  }

  async goto(page: Page, url: string) {
    await page.goto(url, { waitUntil: 'networkidle2' });
  }

  async evaluate(page: Page, selector: string) {
    return await page.evaluate((selector) => {
      const elements = document.querySelectorAll(selector);
      return Array.from(elements).map((element) => element.textContent);
    }, selector);
  }

  async close(browser: Browser, page: Page) {
    await page.close();
    await browser.close();
  }
}
