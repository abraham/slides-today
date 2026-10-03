import { Given } from '@cucumber/cucumber';
import { origin } from '../support/environment.js';

Given(
  'the network is {networkStatus}',
  async function (status: string): Promise<void> {
    await this.page.setOfflineMode(status === 'offline');
  },
);

Given(
  'JavaScript is {javaScriptStatus}',
  async function (status: string): Promise<void> {
    await this.page.setJavaScriptEnabled(status === 'enabled');
  },
);

Given(
  'I have granted permission(s)',
  async function ({ rawTable }): Promise<void> {
    // Available permissions: https://pptr.dev/#?product=Puppeteer&show=api-browsercontextoverridepermissionsorigin-permissions
    const context = this.page.browserContext();
    await context.overridePermissions(origin, rawTable.flat());
  },
);

Given('I am on a {device}', async function (device): Promise<void> {
  await this.page.emulate(device);
});

// Desktop Chrome on macOS has navigator.share, which replaces the custom share menu.
Given('native sharing is unavailable', async function (): Promise<void> {
  await this.page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'share', { value: undefined });
  });
});
