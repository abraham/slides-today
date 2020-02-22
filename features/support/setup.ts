import { After, Before, defineParameterType, setDefaultTimeout, setWorldConstructor } from 'cucumber';
import { BrowserWorld } from './browser-world';
import { DEBUG } from './environment';
import { parameterTypes } from './parameter-types';

const TEN_SECONDS_MS = 10 * 1000;
const SIXTY_SECONDS_MS = 60 * 1000;

setDefaultTimeout(TEN_SECONDS_MS);

if (DEBUG) {
  console.log('Running in DEBUG mode');
  setDefaultTimeout(SIXTY_SECONDS_MS);
}

parameterTypes.forEach(parameterType => {
  defineParameterType(parameterType);
});

setWorldConstructor(BrowserWorld);

Before(async function(_scenario) {
  await this.init();
});

After(async function(_scenario) {
  await this.cleanup();
});
