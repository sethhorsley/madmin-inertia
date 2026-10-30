import React, { useState } from "react"
import { Head } from "@inertiajs/react"
import { Monitor, Moon, Sun } from "lucide-react"
import { Button } from "../../components/ui/button"
import { getTheme, setTheme } from "../../lib/theme"

const THEMES = { light: Sun, dark: Moon, system: Monitor }

export default function Settings({ admin }) {
  const [theme, setCurrent] = useState(getTheme)

  return <>
    <Head title={`Settings - ${admin.name} Admin`} />
    <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
    <section className="space-y-3">
      <h2 className="text-lg font-medium">Appearance</h2>
      <p className="text-sm text-muted-foreground">Saved in this browser.</p>
      <div role="group" aria-label="Theme" className="flex flex-wrap gap-2">
        {Object.entries(THEMES).map(([value, Icon]) => <Button key={value} type="button" variant={theme === value ? "default" : "outline"} aria-pressed={theme === value} className="capitalize" onClick={() => { setTheme(value); setCurrent(value) }}><Icon />{value}</Button>)}
      </div>
    </section>
    {admin.user && <section className="space-y-3">
      <h2 className="text-lg font-medium">Account</h2>
      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1 text-sm"><dt className="text-muted-foreground">Name</dt><dd>{admin.user.name}</dd><dt className="text-muted-foreground">Email</dt><dd>{admin.user.email}</dd></dl>
    </section>}
  </>
}
