import { expect } from 'chai';
import { When } from 'cucumber';
import { wait } from 'pptr-testing-library';
import { isInteractiveElement, sleep } from '../support/utils';

When('I visit {url}', async function (url: string): Promise<void> {
  await this.page.goto(url, { waitUntil: 'networkidle0' });
});

When('I click on {string}', async function (text: string): Promise<void> {
  await wait(async () => {
    const element = await this.getByText(text);
    expect(
      await isInteractiveElement(this.page, element),
      'Element (or close ancestor) must be interactive',
    ).to.eq(true);
    await element.click();
  });
});

When('I sleep for {int}', async (seconds: number): Promise<void> => {
  await sleep(seconds);
});

When('I press {string}', async function (key: string): Promise<void> {
  // See https://pptr.dev/#?product=Puppeteer&show=api-keyboardpresskey-options for list of valid keys
  await this.page.keyboard.press(key);
});

When('I touch the screen', async function (): Promise<void> {
  await this.page.touchscreen.tap(200, 200);
});
