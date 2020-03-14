import { Given } from 'cucumber';
import { origin } from '../support/environment';

Given('the network is {networkStatus}', async function(status: string) {
  return this.page.setOfflineMode(status === 'offline');
});

Given('I have granted permission(s)', async function({ rawTable }) {
  // Available permissions: https://pptr.dev/#?product=Puppeteer&show=api-browsercontextoverridepermissionsorigin-permissions
  const context = this.page.browserContext();
  await context.overridePermissions(origin, rawTable.flat());
});

Given('I am on a {device}', async function(device) {
  await this.page.emulate(device);
});
