export const DEFAULT_THEME = {
  backgroundColor: '#fff',
  color: '#000',
};

export const invert = (theme: Theme): Theme => ({
  backgroundColor: theme.color,
  color: theme.backgroundColor,
});

export const DEFAULT_INVERTED_THEME = invert(DEFAULT_THEME);

export interface Theme {
  backgroundColor: string;
  color: string;
}
