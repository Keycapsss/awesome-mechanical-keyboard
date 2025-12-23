export interface Theme {
  name: string;
  background: string;
  foreground: string;
  accent: string;
}

export type Themes = Record<string, Theme>;

export function initThemeSwitcher(themes: Themes): void {
  function applyTheme(id: string): void {
    const theme = themes[id];
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', theme.foreground);
    root.style.setProperty('--accent', theme.accent);
    localStorage.setItem('theme', id);
  }

  function getOSThemePreference(): string | null {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return null;
  }

  // Apply saved theme on load
  applyTheme(localStorage.getItem('theme') || getOSThemePreference() || 'terminal-dark');

  // Handle theme switcher clicks
  document.querySelectorAll('[data-theme]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const themeId = el.getAttribute('data-theme');
      if (themeId) applyTheme(themeId);
    });
  });

  // Listen for OS theme changes (only if no saved preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}
