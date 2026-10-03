import { expect } from 'chai';
import { When } from '@cucumber/cucumber';
import { wait } from 'pptr-testing-library';
import { isInteractiveElement, sleep } from '../support/utils.js';

When('I visit {url}', async function (url: string): Promise<void> {
  await this.page.goto(url, { waitUntil: 'domcontentloaded' });
});

When('I click on {string}', async function (text: string): Promise<void> {
  await wait(async () => {
    const element = await this.getByText(text);
    expect(
      await isInteractiveElement(this.page, element),
      'Element (or close ancestor) must be interactive',
    ).to.eq(true);
    // Clicks on an element that is still animating, such as a menu item, land in the wrong place.
    const box = await element.boundingBox();
    await sleep(0.1);
    expect(await element.boundingBox(), 'Element must stop moving').to.deep.eq(
      box,
    );
    await element.click();
  });
});

When('I sleep for {int}', async (seconds: number): Promise<void> => {
  await sleep(seconds);
});

// The worker registers only once the app is stable, so it may not be active when the page first renders.
When(
  'the service worker is ready',
  { timeout: 40 * 1000 },
  async function (): Promise<void> {
    await this.page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      const isNormal = async () =>
        (await (await fetch('/ngsw/state')).text()).includes(
          'Driver state: NORMAL',
        );
      while (!(await isNormal())) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    });
  },
);

When('I press {string}', async function (key: string): Promise<void> {
  // See https://pptr.dev/#?product=Puppeteer&show=api-keyboardpresskey-options for list of valid keys
  await this.page.keyboard.press(key);
});

When('I touch the screen', async function (): Promise<void> {
  await this.page.touchscreen.tap(200, 200);
});
