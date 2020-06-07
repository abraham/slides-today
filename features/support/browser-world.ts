import { SelectorMatcherOptions } from '@testing-library/dom';
import { getDocument, queries } from 'pptr-testing-library';
import puppeteer, { Browser, Page } from 'puppeteer';
import { DEBUG } from './environment';

const { getByText, queryAllByText, queryAllByTitle } = queries;

export class BrowserWorld {
  private browser?: Browser;
  private page?: Page;

  get config() {
    return {
      defaultViewport: {
        height: 720,
        width: 1280,
      },
      headless: !DEBUG,
      slowMo: DEBUG ? 100 : 0,
    };
  }

  get $document() {
    return getDocument(this.page);
  }

  async getByText(text: string, opts?: SelectorMatcherOptions) {
    return getByText(await this.$document, text, opts);
  }

  async queryAllByText(text: string, opts?: SelectorMatcherOptions) {
    return queryAllByText(await this.$document, text, opts);
  }

  async queryAllByTitle(text: string, opts?: SelectorMatcherOptions) {
    return queryAllByTitle(await this.$document, text, opts);
  }

  async init() {
    this.browser = await puppeteer.launch(this.config);
    this.page = (await this.browser.pages())[0];
    if (DEBUG) {
      this.page.on('console', consoleObj => {
        console.log(`[BROWSER]: ${consoleObj.text()}`);
      });
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
