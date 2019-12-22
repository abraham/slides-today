export const DEFAULT_THEME = {
  color: '#000',
  backgroundColor: '#fff',
};

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface Theme {
  color: string;
  backgroundColor: string;
}

export function rgb(color: Color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function invert(theme: Theme): Theme {
  return {
    color: theme.backgroundColor,
    backgroundColor: theme.color,
  };
}
