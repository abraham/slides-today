export async function formatTagList(tags: string[]): Promise<string> {
  // TODO: Fix any
  if (!('ListFormat' in Intl)) {
    await import(/* webpackChunkName: 'intl' */ 'intl-list-format' as any);
    await import(/* webpackChunkName: 'intl' */ 'intl-list-format/locale-data/en' as any);
  }
  const formatter = new (Intl as any).ListFormat('en', { style: 'long', type: 'conjunction' });
  return formatter.format(tags.map(tag => `#${tag}`));
}
