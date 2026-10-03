export const DEFAULT_THEME = {
  backgroundColor: '#fff',
  color: '#000',
};

// Surface roles take the deck colors; primary roles take the inverse so buttons and FABs stand out.
export const themeTokens = (theme: Theme): Record<string, string> => ({
  '--mat-sys-on-primary': theme.backgroundColor,
  '--mat-sys-on-primary-container': theme.backgroundColor,
  '--mat-sys-on-surface': theme.color,
  '--mat-sys-on-surface-variant': theme.color,
  '--mat-sys-primary': theme.color,
  '--mat-sys-primary-container': theme.color,
  '--mat-sys-surface': theme.backgroundColor,
  '--mat-sys-surface-container-low': theme.backgroundColor,
});

export interface Theme {
  backgroundColor: string;
  color: string;
}
