export const THEME = 'dark';

export interface ThemeState {
  active: boolean;
  theme: typeof THEME;
}

export const defaultThemeState: ThemeState = {
  active: false,
  theme: THEME,
};

export const LS_THEME_KEY = '@rescoped/theme-switcher';
