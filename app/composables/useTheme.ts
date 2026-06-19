let media: MediaQueryList | null = null

export const useTheme = () => {
  // Dark mode disabled - always return light theme
  const theme = useState<'light' | 'dark'>('theme', () => 'light')

  const setTheme = (value: 'light' | 'dark') => {
    // Force light theme only
    theme.value = 'light'

    if (process.client) {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }

  const initTheme = () => {
    if (!process.client) return

    // Always initialize as light theme
    theme.value = 'light'
    document.documentElement.setAttribute('data-theme', 'light')
    localStorage.setItem('theme', 'light')
  }

  const toggleTheme = () => {
    // Do nothing - dark mode disabled
    console.warn('Dark mode is disabled')
  }

  return { theme, setTheme, initTheme, toggleTheme }
}
