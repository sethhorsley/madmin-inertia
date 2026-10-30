import React, { useState } from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { getTheme, setTheme } from "../lib/theme"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

const THEMES = { light: Sun, dark: Moon, system: Monitor }

export default function ThemeToggle() {
  const [theme, setCurrent] = useState(getTheme)
  const Icon = THEMES[theme]

  return <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label="Theme"><Icon /></Button></DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuRadioGroup value={theme} onValueChange={(value) => { setTheme(value); setCurrent(value) }}>
        {Object.entries(THEMES).map(([value, ItemIcon]) => <DropdownMenuRadioItem key={value} value={value} className="capitalize"><ItemIcon className="size-4" />{value}</DropdownMenuRadioItem>)}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
}
