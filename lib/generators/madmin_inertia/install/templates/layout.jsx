import React from "react"
import { Link, usePage } from "@inertiajs/react"

export default function Layout({ children }) {
  const { admin, flash } = usePage().props
  const path = usePage().url.split("?")[0]
  const active = (url) => path === url || (url !== admin.dashboard && path.startsWith(`${url}/`))

  return <div className="min-h-screen md:flex">
    <nav className="border-b border-neutral-200 p-4 md:w-60 md:border-b-0 md:border-r">
      <Link href={admin.dashboard} className="mb-4 block text-lg font-semibold">{admin.name} Admin</Link>
      <ul className="space-y-1 text-sm">
        <li><Link href={admin.dashboard} className={active(admin.dashboard) ? "font-semibold" : ""}>Dashboard</Link></li>
        {admin.navigation.map((item) => <li key={item.url}><Link href={item.url} className={active(item.url) ? "font-semibold underline" : ""}>{item.label}</Link></li>)}
      </ul>
    </nav>
    <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {Object.entries(flash || {}).map(([kind, message]) => <p key={kind} role={kind === "alert" ? "alert" : "status"} className="rounded-lg border border-neutral-300 p-3">{message}</p>)}
      {children}
    </main>
  </div>
}
