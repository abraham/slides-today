export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export  interface Theme {
  color: string;
  backgroundColor: string;
}

export function rgb(color: Color) {
  if (color.a === undefined) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  } else {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }
}
