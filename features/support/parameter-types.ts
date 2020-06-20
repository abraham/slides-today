import puppeteer from 'puppeteer';
import { origin } from './environment';

const deviceList = Object.keys(puppeteer.devices).join('|');

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
    transformer: (name: string) => puppeteer.devices[name],
  },
  {
    name: 'url',
    regexp: /"([^"]*)"/,
    transformer: (path: string) => `${origin}${path}`,
  },
];
