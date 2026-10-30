import React, { useState } from "react"
import { getTheme, setTheme } from "../lib/theme"

const THEMES = ["light", "dark", "system"]

export default function ThemeToggle() {
  const [theme, setCurrent] = useState(getTheme)
  const choose = (value) => { setTheme(value); setCurrent(value) }

  return <div role="group" aria-label="Theme" className="inline-flex overflow-hidden rounded-lg border border-neutral-300 text-sm dark:border-neutral-700">
    {THEMES.map((value) => <button key={value} type="button" aria-pressed={theme === value} onClick={() => choose(value)}
      className={`px-3 py-1.5 capitalize hover:bg-neutral-100 dark:hover:bg-neutral-800 ${theme === value ? "bg-neutral-100 font-semibold dark:bg-neutral-800" : ""}`}>{value}</button>)}
  </div>
}
