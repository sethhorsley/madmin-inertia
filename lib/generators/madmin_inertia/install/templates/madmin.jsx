import React from "react"
import { createRoot } from "react-dom/client"
import { createInertiaApp } from "@inertiajs/react"
import { pages as madminPages } from "madmin-inertia"
import Dashboard from "./pages/madmin/dashboard"
import Layout from "./pages/madmin/layout"

const pages = madminPages({ "Madmin/Dashboard": Dashboard })

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
