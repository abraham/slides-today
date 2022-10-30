import { KnownDevices } from 'puppeteer';
import { origin } from './environment';

const deviceList = Object.keys(KnownDevices).join('|');

export const parameterTypes = [
  {
    name: 'networkStatus',
    regexp: /"(online|offline)"/,
    transformer: (status: string) => status,
  },
  {
    name: 'javaScriptStatus',
    regexp: /"(enabled|disabled)"/,
    transformer: (status: string) => status,
  },
  {
    name: 'device',
    regexp: new RegExp(`"(${deviceList})"`),
    transformer: (name: keyof typeof KnownDevices) => KnownDevices[name],
  },
  {
    name: 'url',
    regexp: /"([^"]*)"/,
    transformer: (path: string) => `${origin}${path}`,
  },
];
