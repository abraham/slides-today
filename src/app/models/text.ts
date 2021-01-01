// TODO: Remove custom types https://github.com/microsoft/TypeScript/issues/29129

type ListFormatOptions = {
  style: string;
  type: string;
};

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Intl {
  class ListFormat {
    constructor(locale: string, options?: ListFormatOptions);
    public format(items: string[]): string;
  }
}

type ListFormatPolyfill = new (
  lang: string,
  options: Record<string, unknown>,
) => {
  format: (items: string[]) => string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
type IntlPolyfill = { ListFormat: ListFormatPolyfill };

export const formatTagList = async (tags: string[]): Promise<string> => {
  if (!('ListFormat' in Intl)) {
    await import(/* webpackChunkName: 'intl' */ 'intl-list-format' as string);
    await import(
      /* webpackChunkName: 'intl' */ 'intl-list-format/locale-data/en' as string
    );
  }
  const options = {
    style: 'long',
    type: 'conjunction',
  };
  const formatter = new Intl.ListFormat('en', options);
  return formatter.format(tags.map(tag => `#${tag}`));
};
