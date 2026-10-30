import React from "react"
import { createRoot } from "react-dom/client"
import { createInertiaApp } from "@inertiajs/react"
import DefaultDashboard from "./app/javascript/pages/dashboard/index"
import DefaultLayout from "./app/javascript/layouts/admin-layout"
import Resource from "./app/javascript/components/resource-page"
import { registry } from "./app/javascript/lib/registry"

export { default as Field, Value } from "./app/javascript/components/field"
export { default as Filters, indexUrl } from "./app/javascript/components/filters"
export { buttonClass, inputClass } from "./app/javascript/lib/ui"

// Boots the admin. Pass components ejected with `rails g madmin_inertia:views`:
// start({ layout, dashboard, views: { index, "post/show": PostShow } })
export function start({ layout, dashboard, views = {} } = {}) {
  Object.assign(registry, { layout, dashboard, views })
  const Layout = layout || DefaultLayout
  const pages = { "Madmin/Resource": Resource, "Madmin/Dashboard": dashboard || DefaultDashboard }

  createInertiaApp({
    resolve: (name) => {
      const page = pages[name]
      if (!page) throw new Error(`Unknown admin page: ${name}`)
      page.layout = (children) => <Layout>{children}</Layout>
      return page
    },
    setup({ el, App, props }) {
      createRoot(el).render(<App {...props} />)
    },
  })
}
