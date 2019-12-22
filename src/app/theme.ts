export const DEFAULT_THEME = {
  backgroundColor: '#fff',
  color: '#000',
};

export const DEFAULT_INVERTED_THEME = invert(DEFAULT_THEME);

export interface Theme {
  backgroundColor: string;
  color: string;
}

export function invert(theme: Theme): Theme {
  return {
    backgroundColor: theme.color,
    color: theme.backgroundColor,
  };
}
