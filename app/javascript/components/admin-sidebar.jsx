import React, { useState } from "react"
import { Link, usePage } from "@inertiajs/react"
import { inputClass } from "../lib/ui"

const itemClass = (active) => `block rounded-md px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${active ? "bg-neutral-100 font-semibold dark:bg-neutral-800" : ""}`

// "Account / Notifier / Alerts" => group "Account", sublink "Notifier - Alerts"; labels without " / " stay flat.
function namespaced(children) {
  const entries = []
  const parents = {}
  for (const child of children) {
    const [parent, ...rest] = child.label.split(" / ")
    if (!rest.length) { entries.push(child); continue }
    if (!parents[parent]) { parents[parent] = { label: parent, children: [] }; entries.push(parents[parent]) }
    parents[parent].children.push({ ...child, label: rest.join(" - ") })
  }
  return entries
}

// A <details> that opens itself when it holds the current page (or a search match) but stays user-toggleable.
function Group({ label, expanded, forceOpen, className = "", children }) {
  const [open, setOpen] = useState(expanded)
  return <details open={open || forceOpen} onToggle={(event) => setOpen(event.currentTarget.open)} className={className}>
    <summary className="cursor-pointer rounded-md px-2 py-1.5 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">{label}</summary>
    <ul className="ml-3 space-y-0.5 border-l border-neutral-200 dark:border-neutral-800 pl-2">{children}</ul>
  </details>
}

export default function AdminSidebar({ admin }) {
  const path = usePage().url.split("?")[0]
  const [search, setSearch] = useState("")
  const active = (item) => item.url && item.url !== admin.dashboard && (path === item.url || path.startsWith(`${item.url}/`))
  const matches = (item) => item.label.toLowerCase().includes(search.toLowerCase())
  // Links inside the admin navigate with Inertia; anything else is a plain anchor.
  const leaf = (item) => <li key={item.url || item.label}>{item.url?.startsWith(admin.dashboard)
    ? <Link href={item.url} className={itemClass(active(item))}>{item.label}</Link>
    : <a href={item.url || "#"} className={itemClass(false)}>{item.label}</a>}</li>

  const navigation = admin.navigation.filter((item) => matches(item) || item.children.some(matches))

  return <nav className="flex flex-col gap-3 border-b border-neutral-200 dark:border-neutral-800 p-4 text-sm md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-r">
    <Link href={admin.dashboard} className="block px-2 text-lg font-semibold">{admin.name} Admin</Link>
    <input type="search" aria-label="Find a resource" placeholder="Find a resource…" value={search} onChange={(event) => setSearch(event.target.value)} className={inputClass} />
    <ul className="flex-1 space-y-0.5">
      <li><Link href={admin.dashboard} className={itemClass(path === admin.dashboard)}>Dashboard</Link></li>
      {navigation.map((item) => {
        if (item.url) return leaf(item)
        const children = item.children.filter((child) => matches(item) || matches(child))
        return <li key={item.label}><Group label={item.label} expanded={children.some(active)} forceOpen={search !== ""}>
          {namespaced(children).map((entry) => entry.children
            ? <li key={entry.label}><Group label={entry.label} expanded={entry.children.some(active)} forceOpen={search !== ""}>{entry.children.map(leaf)}</Group></li>
            : leaf(entry))}
        </Group></li>
      })}
    </ul>
    {admin.user && <User user={admin.user} logout={admin.logout} />}
  </nav>
}

// Sign out is a real DELETE form post, so it works with Devise-style routes.
function User({ user, logout }) {
  const token = document.querySelector('meta[name="csrf-token"]')?.content
  return <div className="border-t border-neutral-200 dark:border-neutral-800 px-2 pt-3">
    <p className="truncate font-medium">{user.name}</p>
    {user.email && <p className="truncate text-xs text-neutral-500">{user.email}</p>}
    {logout && <form method="post" action={logout} className="mt-2">
      <input type="hidden" name="_method" value="delete" />
      <input type="hidden" name="authenticity_token" value={token} />
      <button type="submit" className="text-xs underline">Sign out</button>
    </form>}
  </div>
}
