import {
  After,
  Before,
  defineParameterType,
  setDefaultTimeout,
  setWorldConstructor,
} from '@cucumber/cucumber';
import { BrowserWorld } from './browser-world';
import { DEBUG } from './environment';
import { parameterTypes } from './parameter-types';

const TEN_SECONDS_MS = 10 * 1000;
const THIRTY_SECONDS_MS = 30 * 1000;

setDefaultTimeout(TEN_SECONDS_MS);

if (DEBUG) {
  console.log('Running in DEBUG mode');
  setDefaultTimeout(THIRTY_SECONDS_MS);
}

parameterTypes.forEach(defineParameterType);

setWorldConstructor(BrowserWorld);

Before(async function (_scenario): Promise<void> {
  await this.init();
});

After(async function (_scenario): Promise<void> {
  await this.cleanup();
});
