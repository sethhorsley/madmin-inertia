const KEY = "madmin-theme"
const dark = window.matchMedia("(prefers-color-scheme: dark)")

// @return ["light", "dark", "system"] the saved choice, "system" by default
export const getTheme = () => {
  try { return localStorage.getItem(KEY) || "system" } catch { return "system" }
}

// Saves the choice and toggles the `dark` class that Tailwind's class-based dark variant reads.
export function setTheme(theme) {
  try { localStorage.setItem(KEY, theme) } catch { /* private mode: applies for this page only */ }
  applyTheme()
}

export function applyTheme() {
  const theme = getTheme()
  const isDark = theme === "dark" || (theme === "system" && dark.matches)
  document.documentElement.classList.toggle("dark", isDark)
  document.documentElement.style.colorScheme = isDark ? "dark" : "light"
}

dark.addEventListener("change", applyTheme)
applyTheme()
