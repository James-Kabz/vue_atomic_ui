const MODE_KEY = 'ui-mode'

const isBrowser = () => typeof document !== 'undefined'

const applyMode = (mode) => {
  if (!isBrowser()) return
  document.documentElement.setAttribute('data-mode', mode)
}

export const getMode = () => {
  if (!isBrowser()) return null
  return document.documentElement.getAttribute('data-mode')
}

export const getTheme = () => null

export const setTheme = () => {}

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
    defaultMode = 'light'
  } = options

  const storedMode = localStorage.getItem(MODE_KEY)

  applyMode(storedMode || defaultMode)
}
