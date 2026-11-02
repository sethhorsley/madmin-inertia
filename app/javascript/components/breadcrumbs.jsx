import React from "react"
import { Link } from "@inertiajs/react"
import { trail } from "@/lib/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

// Admin name > section > page, like the sidebar's grouping. "Account / Notifier" reads "Account - Notifier".
export default function Breadcrumbs({ admin, path }) {
  const [section, page] = trail(admin.navigation, path, admin.dashboard)
  const current = (page || section)?.label.replaceAll(" / ", " - ") || (path === admin.settings ? "Settings" : "Dashboard")

  return <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem className="hidden md:block"><BreadcrumbLink asChild><Link href={admin.dashboard}>{admin.name} Admin</Link></BreadcrumbLink></BreadcrumbItem>
      {section && page && <><BreadcrumbSeparator className="hidden md:block" /><BreadcrumbItem className="hidden md:block">{section.label}</BreadcrumbItem></>}
      <BreadcrumbSeparator className="hidden md:block" />
      <BreadcrumbItem><BreadcrumbPage>{current}</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
}
