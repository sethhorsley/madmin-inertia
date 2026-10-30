import React from "react"
import { usePage } from "@inertiajs/react"
import AdminSidebar from "../components/admin-sidebar"
import ThemeToggle from "../components/theme-toggle"

export default function Layout({ children }) {
  const { admin, flash } = usePage().props

  return <div className="min-h-screen bg-white text-neutral-900 md:flex dark:bg-neutral-950 dark:text-neutral-100">
    <AdminSidebar admin={admin} />
    <main className="min-w-0 flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-end"><ThemeToggle /></div>
      {Object.entries(flash || {}).map(([kind, message]) => <p key={kind} role={kind === "alert" ? "alert" : "status"} className="rounded-lg border border-neutral-300 p-3">{message}</p>)}
      {children}
    </main>
  </div>
}
