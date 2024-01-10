export type SelectorType = {
  key: string;
  selector: string | (() => string);
  attr?: string;
};

export type ProblemKey =
  | 'title'
  | 'ojProblemId'
  | 'timeLimit'
  | 'memoryLimit'
  | 'problemDescriptionHTML'
  | 'pdfUrl'
  | 'inputDescription'
  | 'outputDescription'
  | 'sampleInput'
  | 'sampleOutput';

export const lightOjSelectors: Array<SelectorType> = [
  { key: 'title', selector: 'div.title' },
  {
    key: 'ojProblemId',
    selector: () => {
      const element = document.querySelector<HTMLElement>('span.tag');
      return element?.innerText.replace('LOJ-', '').trim() || '';
    },
  },
  {
    key: 'timeLimit',
    selector: 'div:nth-child(1) > div.tooltip-trigger > span',
  },
  {
    key: 'memoryLimit',
    selector: 'div:nth-child(2) > div.tooltip-trigger > span',
  },
  // { key: 'imageUrl', selector: 'div.markdown-body > p > img', attr: 'src' },
  {
    key: 'problemDescriptionHTML',
    selector:
      'div[role="tabpanel"] > div > div > div.card-body > div > div:nth-child(1) > div.markdown-body',
  },
  {
    key: 'inputDescription',
    selector:
      'div[role="tabpanel"] > div > div > div.card-body > div > div:nth-child(2) > div.markdown-body',
  },
  {
    key: 'outputDescription',
    selector:
      'div[role="tabpanel"] > div > div > div.card-body > div > div:nth-child(3) > div.markdown-body',
  },
  {
    key: 'sampleInput',
    selector: 'table > tbody > tr > td:nth-child(1) > div > div > p',
  },
  {
    key: 'sampleOutput',
    selector: 'table > tbody > tr > td:nth-child(2) > div > div > p',
  },
];

export const timusOjSelectors: Array<SelectorType> = [
  { key: 'title', selector: 'h2.problem_title' },
  // { key: 'ojProblemId', selector: 'span.tag' },
  {
    key: 'timeLimit',
    selector: () => {
      const element = document.querySelector<HTMLElement>('div.problem_limits');
      if (!element) {
        return null;
      }

      const problem_limits = element.innerText.trim();
      const timeLimitRegex = /\d+(\.\d+)?\ssecond/;
      const timeLimit = problem_limits.match(timeLimitRegex)[0];
      return timeLimit;
    },
  },
  {
    key: 'memoryLimit',
    selector: () => {
      const element = document.querySelector<HTMLElement>('div.problem_limits');
      if (!element) {
        return null;
      }

      const problem_limits = element.innerText.trim();
      const memoryLimitRegex = /\d+\sMB/;
      const timeLimit = problem_limits.match(memoryLimitRegex)[0];
      return timeLimit;
    },
  },
  {
    key: 'problemDescriptionHTML',
    selector: '.problem_par',
  },
  {
    key: 'inputDescription',
    selector: () => {
      const inputHeader = Array.from(
        document.querySelectorAll<HTMLElement>('h3.problem_subtitle'),
      ).find((h) => h.textContent?.includes('Input'));
      return inputHeader?.nextElementSibling?.textContent.trim() || '';
    },
  },
  {
    key: 'outputDescription',
    selector: () => {
      const outputHeader = Array.from(
        document.querySelectorAll<HTMLElement>('h3.problem_subtitle'),
      ).find((h) => h.textContent?.includes('Output'));
      return outputHeader?.nextElementSibling?.textContent.trim() || '';
    },
  },
  {
    key: 'sampleInput',
    selector: () => {
      const rows = Array.from(document.querySelectorAll('table.sample tr'));
      let sampleInput = '';

      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 2) {
          sampleInput = cells[0].textContent.trim();
        }
      });
      return sampleInput;
    },
  },
  {
    key: 'sampleOutput',
    selector: () => {
      const rows = Array.from(document.querySelectorAll('table.sample tr'));
      let sampleOutput = '';

      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 2) {
          sampleOutput = cells[1].textContent.trim();
        }
      });
      return sampleOutput;
    },
  },
  {
    key: 'notes',
    selector: () => {
      const notesHeader = Array.from(
        document.querySelectorAll<HTMLElement>('h3.problem_subtitle'),
      ).find((h) => h.textContent?.includes('Notes'));
      return notesHeader?.nextElementSibling?.textContent.trim() || '';
    },
  },
];

export const uvaOjSelectors: Array<SelectorType> = [
  {
    key: 'pdfUrl',
    selector: () => {
      const element = document.querySelector<HTMLIFrameElement>(
        '#col3_content_wrapper > iframe',
      );

      if (!element) {
        return null;
      }

      const pdfUrl = element?.src;

      return pdfUrl.replace(/(\d+)\.html$/, 'p$1.pdf');
    },
  },
  { key: 'title', selector: 'table > tbody > tr:nth-child(2) > td > h3' },
  {
    key: 'ojProblemId',
    selector: () => {
      const element = document.querySelector<HTMLElement>(
        'table > tbody > tr:nth-child(2) > td > h3',
      );
      if (!element) {
        return null;
      }
      const title = element.innerText.trim();
      const ojProblemId = title.match(/\d+/)[0];
      return ojProblemId;
    },
  },
  {
    key: 'timeLimit',
    selector: () => {
      const element = document.querySelector<HTMLElement>(
        '#col3_content_wrapper > table > tbody > tr:nth-child(2) > td',
      );

      if (!element) {
        return null;
      }

      const timeLimit = element.innerText.trim().match(/Time limit: (.*)/)[1];
      return timeLimit;
    },
  },
];

export const codeforcesOjSelectors: Array<SelectorType> = [];

export const spojOjSelectors: Array<SelectorType> = [];
