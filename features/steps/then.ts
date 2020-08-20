import { expect } from 'chai';
import { Then } from 'cucumber';
import { wait } from 'pptr-testing-library';
import { Page } from 'puppeteer';
import { origin } from '../support/environment';

Then('I should not see {string}', async function (text): Promise<void> {
  await wait(async () => {
    expect(await this.queryAllByText(text)).to.have.lengthOf(0);
  });
});

Then('I should see {string} {int} time(s)', async function (
  text,
  count,
): Promise<void> {
  await wait(async () => {
    expect(await this.queryAllByText(text)).to.have.lengthOf(count);
  });
});

Then(/^I should see "([^"]*)?"( included)?$/, async function (
  text,
  included,
): Promise<void> {
  await wait(async () => {
    expect(
      await this.queryAllByText(text, { exact: !included }),
    ).to.have.lengthOf(1);
  });
});

Then('I should be on {url}', function (url): void {
  expect(this.page.url()).to.eq(url);
});

Then('visiting {url} fails with {string}', async function (
  url: string,
  error: string,
): Promise<void> {
  try {
    await this.page.goto(url, { waitUntil: 'networkidle0' });
    throw new Error('Network request did not fail');
  } catch (e) {
    expect(e.message).to.eq(`net::${error} at ${url}`);
  }
});

Then('{string} should popup', function (url, done): void {
  this.page.once('popup', async (page: Page) => {
    expect(page.url()).to.eq(url);
    await page.close();
    done();
  });
});

Then('{string} should be in the clipboard', async function (
  text: string,
): Promise<void> {
  const context = this.page.browserContext();
  await context.overridePermissions(origin, [
    'clipboard-write',
    'clipboard-read',
  ]);
  const clipboardText = await this.page.evaluate(() =>
    navigator.clipboard.readText(),
  );
  expect(clipboardText).to.eq(text);
  await context.clearPermissionOverrides();
});

Then('I should see title {string}', async function (
  text: string,
): Promise<void> {
  await wait(async () => {
    expect(await this.queryAllByTitle(text)).to.have.lengthOf(1);
  });
});
