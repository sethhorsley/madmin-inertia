import React, { useState } from "react"
import { usePage } from "@inertiajs/react"
import AdminSidebar from "../components/admin-sidebar"
import Breadcrumbs from "../components/breadcrumbs"
import ThemeToggle from "../components/theme-toggle"

export default function Layout({ children }) {
  const { admin, flash } = usePage().props
  const path = usePage().url.split("?")[0]
  const [sidebarOpen, setSidebarOpen] = useState(() => window.matchMedia("(min-width: 768px)").matches)

  return <div className="min-h-screen bg-white text-neutral-900 md:flex dark:bg-neutral-950 dark:text-neutral-100">
    <AdminSidebar admin={admin} open={sidebarOpen} />
    <div className="min-w-0 flex-1">
      <header className="flex h-16 items-center justify-between gap-2 border-b border-neutral-200 px-4 dark:border-neutral-800">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" aria-label="Toggle sidebar" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>
          </button>
          <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
          <Breadcrumbs admin={admin} path={path} />
        </div>
        <ThemeToggle />
      </header>
      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        {Object.entries(flash || {}).map(([kind, message]) => <p key={kind} role={kind === "alert" ? "alert" : "status"} className="rounded-lg border border-neutral-300 p-3 dark:border-neutral-700">{message}</p>)}
        {children}
      </main>
    </div>
  </div>
}
