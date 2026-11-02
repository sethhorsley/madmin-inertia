import React from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { setTheme, useTheme } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const THEMES = { light: Sun, dark: Moon, system: Monitor }

export default function ThemeToggle() {
  const theme = useTheme()
  const Icon = THEMES[theme]

  return <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label="Theme"><Icon /></Button></DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
        {Object.entries(THEMES).map(([value, ItemIcon]) => <DropdownMenuRadioItem key={value} value={value} className="capitalize"><ItemIcon className="size-4" />{value}</DropdownMenuRadioItem>)}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
}
