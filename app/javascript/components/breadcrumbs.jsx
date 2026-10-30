import React from "react"
import { Link } from "@inertiajs/react"
import { trail } from "../lib/navigation"

// Admin name > section > page, like the sidebar's grouping. "Account / Notifier" reads "Account - Notifier".
export default function Breadcrumbs({ admin, path }) {
  const [section, page] = trail(admin.navigation, path, admin.dashboard)
  const crumbs = [section && page && section.label, (page || section)?.label.replaceAll(" / ", " - ") || "Dashboard"].filter(Boolean)

  return <nav aria-label="Breadcrumb"><ol className="flex min-w-0 items-center gap-2 text-sm">
    <li className="hidden md:block"><Link href={admin.dashboard} className="hover:underline">{admin.name} Admin</Link></li>
    {crumbs.map((label, index) => {
      const last = index === crumbs.length - 1
      return <React.Fragment key={label}>
        <li aria-hidden="true" className="hidden md:block">/</li>
        <li {...(last && { "aria-current": "page" })} className={last ? "truncate font-medium" : "hidden md:block"}>{label}</li>
      </React.Fragment>
    })}
  </ol></nav>
}
