import 'intl-list-format';
import 'intl-list-format/locale-data/en';

export function formatTagList(tags: string[]): string {
  // TODO: Fix any
  const formatter = new (Intl as any).ListFormat('en', { style: 'long', type: 'conjunction' });
  return formatter.format(tags.map(tag => `#${tag}`));
}
