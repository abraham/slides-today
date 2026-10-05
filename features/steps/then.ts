import { expect } from 'chai';
import { Then } from '@cucumber/cucumber';
import { wait } from 'pptr-testing-library';
import { origin } from '../support/environment.js';

Then('I should not see {string}', async function (text): Promise<void> {
  await wait(async () => {
    expect(await this.queryAllByText(text)).to.have.lengthOf(0);
  });
});

Then(
  'I should see {string} {int} time(s)',
  async function (text, count): Promise<void> {
    await wait(async () => {
      expect(await this.queryAllByText(text)).to.have.lengthOf(count);
    });
  },
);

Then(
  /^I should see "([^"]*)?"( included)?$/,
  async function (text, included): Promise<void> {
    await wait(async () => {
      expect(
        await this.queryAllByText(text, { exact: !included }),
      ).to.have.lengthOf(1);
    });
  },
);

Then('I should be on {url}', function (url): void {
  expect(this.page.url()).to.eq(url);
});

Then('the response status should be {int}', function (status: number): void {
  expect(this.response.status()).to.eq(status);
});

Then(
  'visiting {url} fails with {string}',
  async function (url: string, error: string): Promise<void> {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle0' });
      throw new Error('Network request did not fail');
    } catch (e) {
      expect(e.message).to.eq(`net::${error} at ${url}`);
    }
  },
);

// Checks the link instead of following it, so tests don't depend on third-party sites.
Then(
  '{string} should open {string} in a new tab',
  async function (text: string, url: string): Promise<void> {
    await wait(async () => {
      const element = await this.getByText(text);
      const link = await element.evaluate(el => {
        const anchor = el.closest('a');
        return { href: anchor?.href, target: anchor?.target };
      });
      expect(link).to.deep.eq({ href: url, target: '_blank' });
    });
  },
);

Then(
  '{string} should be in the clipboard',
  async function (text: string): Promise<void> {
    const context = this.page.browserContext();
    await context.overridePermissions(origin, [
      'clipboard-write',
      'clipboard-read',
    ]);
    await wait(async () => {
      const clipboardText = await this.page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      expect(clipboardText).to.eq(text);
    });
    await context.clearPermissionOverrides();
  },
);

Then(
  'I should see title {string}',
  async function (text: string): Promise<void> {
    await wait(async () => {
      expect(await this.queryAllByTitle(text)).to.have.lengthOf(1);
    });
  },
);
