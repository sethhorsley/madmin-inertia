import React from "react"
import { createRoot } from "react-dom/client"
import { createInertiaApp } from "@inertiajs/react"
import DefaultDashboard from "./app/javascript/pages/dashboard"
import DefaultLayout from "./app/javascript/pages/layout"
import Resource from "./app/javascript/pages/resource"
import { registry } from "./app/javascript/pages/registry"

export { default as Field, Value } from "./app/javascript/pages/field"
export { default as Filters, indexUrl } from "./app/javascript/pages/filters"
export { buttonClass, inputClass } from "./app/javascript/pages/ui"

// Page map for apps that run their own createInertiaApp instead of start().
export const pages = (extra = {}) => ({ "Madmin/Resource": Resource, ...extra })

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
