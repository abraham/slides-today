export const formatTagList = (tags: string[]): string =>
  new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(
    tags.map(tag => `#${tag}`),
  );
