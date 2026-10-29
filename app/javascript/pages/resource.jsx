import React from "react"
import { Head, Link, router } from "@inertiajs/react"
import { registry } from "./registry"
import { buttonClass } from "./ui"
import Form from "./views/form"
import Index from "./views/index"
import Show from "./views/show"

const defaults = { index: Index, show: Show, form: Form }

// Page header plus the body for the current mode. A view ejected for this resource
// ("post/index") wins over an ejected generic one ("index"), which wins over the gem's.
export default function Resource(props) {
  const { mode, resource, record, urls, admin } = props
  const name = ["new", "edit"].includes(mode) ? "form" : mode
  const View = registry.views[`${resource.key}/${name}`] || registry.views[name] || defaults[name]
  const title = mode === "index" ? resource.label : mode === "new" ? `New ${resource.name}` : mode === "edit" ? `Edit ${record.label}` : record.label
  return <>
    <Head title={`${title} - ${admin.name} Admin`} />
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>{mode !== "index" && <Link href={urls.index} className="mb-2 block text-sm underline">← {resource.label}</Link>}<h1 className="text-2xl font-semibold tracking-tight">{title}</h1></div>
      <div className="flex flex-wrap gap-2">
        {mode === "index" && <Link href={urls.new} className={buttonClass}>New {resource.name}</Link>}
        {mode === "show" && <><Link href={record.edit_url} className={buttonClass}>Edit</Link><button type="button" className={buttonClass} onClick={() => { if (window.confirm(`Delete ${record.label}? This cannot be undone.`)) router.delete(record.url) }}>Delete</button></>}
      </div>
    </header>
    <View key={mode === "index" ? undefined : `${resource.key}-${record.id}-${mode}`} {...props} />
  </>
}
