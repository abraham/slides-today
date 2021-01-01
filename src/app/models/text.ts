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

export const formatTagList = async (tags: string[]): Promise<string> => {
  const hashtags = tags.map(tag => `#${tag}`);
  if ('ListFormat' in Intl) {
    const options = {
      style: 'long',
      type: 'conjunction',
    };
    const formatter = new Intl.ListFormat('en', options);
    return formatter.format(hashtags);
  } else {
    return hashtags.join(', ');
  }
};
