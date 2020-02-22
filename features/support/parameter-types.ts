import puppeteer from 'puppeteer';
import { origin } from './environment';

export const parameterTypes = [
  {
    name: 'networkStatus',
    regexp: /"(online|offline)"/,
    transformer: (status: string) => status,
  },
  {
    name: 'device',
    regexp: new RegExp(`"(${puppeteer.devices.map(device => device.name).join('|')})"`),
    transformer: (name: string) => puppeteer.devices[name],
  },
  {
    name: 'url',
    regexp: /"([^"]*)"/,
    transformer: (path: string) => `${origin}${path}`,
  },
];
