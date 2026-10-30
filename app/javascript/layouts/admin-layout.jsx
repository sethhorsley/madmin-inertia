import React from "react"
import { usePage } from "@inertiajs/react"
import AdminSidebar from "../components/admin-sidebar"

export default function Layout({ children }) {
  const { admin, flash } = usePage().props

  return <div className="min-h-screen md:flex">
    <AdminSidebar admin={admin} />
    <main className="min-w-0 flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {Object.entries(flash || {}).map(([kind, message]) => <p key={kind} role={kind === "alert" ? "alert" : "status"} className="rounded-lg border border-neutral-300 p-3">{message}</p>)}
      {children}
    </main>
  </div>
}
