import { ElementHandle, Page } from 'puppeteer';

export const sleep = (seconds: number) => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

const validTag = (value: unknown) => {
  const validTagNames = ['A', 'BUTTON'];
  return typeof value === 'string' && validTagNames.includes(value.toUpperCase());
};

const interactiveTag = async (page: Page, element: ElementHandle): Promise<boolean> => {
  const tagNames = await page.evaluate((el: Element) => {
    return [el.tagName, el.getAttribute('role')];
  }, element);
  return tagNames.some((tagName: string|null) => validTag(tagName));
};

export const isInteractiveElement = async (page: Page, element: ElementHandle|null): Promise<boolean> => {
  let i = 0;
  while (element && i < 4) {
    if (await interactiveTag(page, element)) {
      return true;
    } else {
      i++;
      element = await element.getProperty('parentElement').then(e => e.asElement());
    }
  }
  return false;
};
