export const DEFAULT_THEME = {
  backgroundColor: '#fff',
  color: '#000',
};

export interface Color {
  a?: number;
  b: number;
  g: number;
  r: number;
}

export interface Theme {
  backgroundColor: string;
  color: string;
}

export function rgb(color: Color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function invert(theme: Theme): Theme {
  return {
    backgroundColor: theme.color,
    color: theme.backgroundColor,
  };
}
