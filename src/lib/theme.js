const THEME_KEY = 'ui-theme'
const MODE_KEY = 'ui-mode'

const isBrowser = () => typeof document !== 'undefined'

const applyTheme = (theme) => {
  if (!isBrowser()) return
  document.documentElement.setAttribute('data-theme', theme)
}

const applyMode = (mode) => {
  if (!isBrowser()) return
  document.documentElement.setAttribute('data-mode', mode)
}

export const getTheme = () => {
  if (!isBrowser()) return null
  return document.documentElement.getAttribute('data-theme')
}

export const getMode = () => {
  if (!isBrowser()) return null
  return document.documentElement.getAttribute('data-mode')
}

export const setTheme = (theme) => {
  if (!theme) return
  applyTheme(theme)
  if (isBrowser()) {
    localStorage.setItem(THEME_KEY, theme)
  }
}

export const setMode = (mode) => {
  if (!mode) return
  applyMode(mode)
  if (isBrowser()) {
    localStorage.setItem(MODE_KEY, mode)
  }
}

export const initTheme = (options = {}) => {
  if (!isBrowser()) return
  const {
    defaultTheme = 'ocean',
    defaultMode = 'light'
  } = options

  const storedTheme = localStorage.getItem(THEME_KEY)
  const storedMode = localStorage.getItem(MODE_KEY)

  applyTheme(storedTheme || defaultTheme)
  applyMode(storedMode || defaultMode)
}
