export const formatList = (items: string[]): string =>
  new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(
    items,
  );

export const formatTagList = (tags: string[]): string =>
  formatList(tags.map(tag => `#${tag}`));
