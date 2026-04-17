let media: MediaQueryList | null = null

export const useTheme = () => {
  const theme = useState<'light' | 'dark'>('theme', () => 'light')

  const setTheme = (value: 'light' | 'dark') => {
    theme.value = value

    if (process.client) {
      document.documentElement.setAttribute('data-theme', value)
      localStorage.setItem('theme', value)
    }
  }

  const initTheme = () => {
    if (!process.client) return

    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null

    if (!media) {
      media = window.matchMedia('(prefers-color-scheme: dark)')

      const handler = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light'
        const saved = localStorage.getItem('theme')

        if (!saved) {
          theme.value = newTheme
          document.documentElement.setAttribute('data-theme', newTheme)
        }
      }

      media.addEventListener('change', handler)
    }

    const preferred = media.matches ? 'dark' : 'light'

    const value = saved || preferred

    theme.value = value

    document.documentElement.setAttribute('data-theme', value)

    if (saved) {
      localStorage.setItem('theme', value)
    }
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, setTheme, initTheme, toggleTheme }
}
