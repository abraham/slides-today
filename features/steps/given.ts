import { Given } from 'cucumber';
import { origin } from '../support/environment';
import { flat } from '../support/utils';

Given('the network is {networkStatus}', async function (status: string) {
  return this.page.setOfflineMode(status === 'offline');
});

Given('JavaScript is {javaScriptStatus}', async function (status: string) {
  return this.page.setJavaScriptEnabled(status === 'enabled');
});

Given('I have granted permission(s)', async function ({ rawTable }) {
  // Available permissions: https://pptr.dev/#?product=Puppeteer&show=api-browsercontextoverridepermissionsorigin-permissions
  const context = this.page.browserContext();
  await context.overridePermissions(origin, flat(rawTable));
});

Given('I am on a {device}', async function (device) {
  await this.page.emulate(device);
});
