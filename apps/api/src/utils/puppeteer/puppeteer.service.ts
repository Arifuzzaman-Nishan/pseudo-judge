import { Injectable } from '@nestjs/common';
import type {
  Browser,
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions,
  Page,
} from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

type LaunchParams = LaunchOptions &
  BrowserLaunchArgumentOptions &
  BrowserConnectOptions;
@Injectable()
export class PuppeteerService {
  private browser: Browser;
  private page: Page;

  async launch(launchOptions?: LaunchParams) {
    this.browser = await puppeteer.launch(launchOptions);
    this.page = await this.browser.newPage();
    this.page.setDefaultNavigationTimeout(50000);
    await this.page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
    );

    return {
      browser: this.browser,
      page: this.page,
    };
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async getDataFromHTMLSelector(selector: string | (() => string)) {
    if (typeof selector === 'string') {
      return await this.page.evaluate((selector) => {
        const element = document.querySelector<HTMLElement>(selector);

        if (!element) {
          return null;
        }

        return element.innerText.trim();
      }, selector);
    } else {
      return await this.page.evaluate(selector);
    }
  }

  async getLightOjProblemDescription(selector: string) {
    const outerHTMLWithAttributes = await this.page.$eval(
      selector,
      (element: Element) => {
        // const html = element.outerHTML.trim().replace(/\n/g, '');

        const html = element.outerHTML;

        const removeAttributesExceptImages = (html: string) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          doc.querySelectorAll('*').forEach((el) => {
            if (el.tagName.toLowerCase() !== 'img') {
              Array.from(el.attributes).forEach((attr) =>
                el.removeAttribute(attr.name),
              );
            }
          });
          return doc.body.innerHTML;
        };

        const processedHTML = removeAttributesExceptImages(html);
        return processedHTML;
      },
    );

    return outerHTMLWithAttributes;
  }

  async getTimusOjProblemDescription(selector: string) {
    const processedHTML = await this.page.$$eval(
      selector,
      (elements: Element[]) => {
        let html = '';

        for (const element of elements) {
          if (
            element.nextElementSibling &&
            element.nextElementSibling.tagName === 'H3' &&
            element.nextElementSibling.textContent.includes('Input')
          ) {
            break;
          }
          html += element.outerHTML;
        }

        const removeAttributesExceptImages = (html: string) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          doc.querySelectorAll('*').forEach((el) => {
            if (el.tagName.toLowerCase() !== 'img') {
              Array.from(el.attributes).forEach((attr) =>
                el.removeAttribute(attr.name),
              );
            }
          });
          return doc.body.innerHTML;
        };

        const processedHTML = removeAttributesExceptImages(html);
        return processedHTML;
      },
    );

    return processedHTML;
  }

  async getDataFromINPUTSelector(selector: string) {
    return await this.page.evaluate((selector) => {
      return document.querySelector<HTMLInputElement>(selector).value;
    }, selector);
  }

  timer(ms: number) {
    return new Promise((reslove) => setTimeout(reslove, ms));
  }

  async typing(typingText: string, selector: string) {
    await this.page.waitForSelector(selector, {
      visible: true,
      timeout: 9000,
    });
    await this.page.focus(selector);
    await this.page.keyboard.type(typingText, {
      delay: 90,
    });
    await this.timer(3000);
    await this.page.keyboard.press('Enter');
    await this.timer(5000);
  }

  async getCookies() {
    const cookies = await this.page.cookies();
    let cookieString = '';

    cookies.forEach((cookie) => {
      if (
        cookie.name === 'lightoj-session' ||
        cookie.name === 'lightoj-session-values'
      ) {
        cookieString += `${cookie.name}=${cookie.value}; `;
      }
    });

    return cookieString;
  }

  async close() {
    await this.page.close();
    await this.browser.close();
  }
}
