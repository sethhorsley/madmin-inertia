import React from "react"
import { usePage } from "@inertiajs/react"
import AdminSidebar from "@/components/admin-sidebar"
import Breadcrumbs from "@/components/breadcrumbs"
import ThemeToggle from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Layout({ children }) {
  const { admin, flash } = usePage().props
  const path = usePage().url.split("?")[0]

  return <SidebarProvider>
    <AdminSidebar admin={admin} path={path} />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
        <div className="flex min-w-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumbs admin={admin} path={path} />
        </div>
        <div className="px-4"><ThemeToggle /></div>
      </header>
      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        {Object.entries(flash || {}).map(([kind, message]) => <p key={kind} role={kind === "alert" ? "alert" : "status"} className="rounded-lg border p-3">{message}</p>)}
        {children}
      </main>
    </SidebarInset>
  </SidebarProvider>
}
