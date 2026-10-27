import React from "react"
import { Head, Link, router, useForm } from "@inertiajs/react"
import Field, { Value } from "./field"
import { buttonClass, inputClass } from "./ui"
import Filters, { indexUrl } from "./filters"

function ResourceForm({ fields, record, resource, mode, urls, uploads, errors }) {
  const form = useForm(Object.fromEntries(fields.map((field) => [field.key, record.values[field.name]])))
  function submit(event) {
    event.preventDefault()
    form.transform((data) => {
      const values = {}
      for (const field of fields) {
        if (field.readonly) continue
        let value = data[field.key]
        if (["attachment", "attachments", "file"].includes(field.type) && !(value instanceof File) && !Array.isArray(value)) continue
        if (field.type === "polymorphic") value = { type: "polymorphic", value }
        if (field.type === "has_many" && value.length === 0) value = [""]
        if (["date_time", "datetime"].includes(field.type) && value) value += "Z"
        values[field.key] = value
      }
      return { [resource.key]: values, ...(mode === "edit" ? { _method: "patch" } : {}) }
    })
    form.post(mode === "edit" ? record.url : urls.index, { preserveScroll: true, forceFormData: mode === "edit" })
  }
  return <form onSubmit={submit} className="max-w-3xl space-y-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
    {Object.keys(errors).length > 0 && <div role="alert" className="rounded-lg border border-red-300 p-3 text-sm text-red-700 dark:border-red-800 dark:text-red-400"><p className="font-semibold">Please correct the following:</p><ul className="list-inside list-disc">{Object.entries(errors).map(([name, messages]) => <li key={name}>{[].concat(messages).join(", ")}</li>)}</ul></div>}
    {fields.map((field) => <Field key={field.name} field={field} value={form.data[field.key]} onChange={(value) => form.setData(field.key, value)} uploads={uploads} error={errors[field.name] || errors[field.key]} />)}
    <div className="flex gap-3"><button type="submit" disabled={form.processing} className={buttonClass}>{form.processing ? "Saving…" : "Save"}</button><Link href={mode === "edit" ? record.url : urls.index} className={buttonClass}>Cancel</Link></div>
  </form>
}

export default function Resource(props) {
  const { mode, resource, fields, records, record, urls, filters, scopes, pagination, admin, filter_columns, filter_operators, active_filters } = props
  const title = mode === "index" ? resource.label : mode === "new" ? `New ${resource.name}` : mode === "edit" ? `Edit ${record.label}` : record.label
  function search(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    router.get(indexUrl(urls.index, { ...filters, q: data.get("q"), scope: data.get("scope"), page: null }, active_filters))
  }
  return <>
    <Head title={`${title} - ${admin.name} Admin`} />
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>{mode !== "index" && <Link href={urls.index} className="mb-2 block text-sm underline">← {resource.label}</Link>}<h1 className="text-2xl font-semibold tracking-tight">{title}</h1></div>
      <div className="flex flex-wrap gap-2">
        {mode === "index" && <Link href={urls.new} className={buttonClass}>New {resource.name}</Link>}
        {mode === "show" && <><Link href={record.edit_url} className={buttonClass}>Edit</Link><button type="button" className={buttonClass} onClick={() => { if (window.confirm(`Delete ${record.label}? This cannot be undone.`)) router.delete(record.url) }}>Delete</button></>}
      </div>
    </header>
    {mode === "index" && <>
      <form onSubmit={search} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="block sm:w-80"><span className="mb-1 block text-sm font-medium">Search {resource.label}</span><input key={filters.q} name="q" type="search" defaultValue={filters.q} className={inputClass} /></label>
        <label><span className="mb-1 block text-sm font-medium">Scope</span><select name="scope" defaultValue={filters.scope} key={filters.scope} className={inputClass}>{scopes.map((scope) => <option key={scope.value} value={scope.value}>{scope.label}</option>)}</select></label>
        <button type="submit" className={buttonClass}>Search</button>
        {filters.q && <Link href={urls.index} className={buttonClass}>Clear</Link>}
      </form>
      <Filters urls={urls} params={filters} columns={filter_columns} operators={filter_operators} active={active_filters} />
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-sm"><caption className="sr-only">{resource.label}</caption><thead className="border-b border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950"><tr>
          {fields.map((field) => <th key={field.name} scope="col" className="whitespace-nowrap px-4 py-3 text-left" aria-sort={filters.sort === field.name ? (filters.direction === "asc" ? "ascending" : "descending") : "none"}>{field.sortable ? <Link href={indexUrl(urls.index, { ...filters, sort: field.name, direction: filters.sort === field.name && filters.direction === "asc" ? "desc" : "asc" }, active_filters)}>{field.label}{filters.sort === field.name ? (filters.direction === "asc" ? " ↑" : " ↓") : ""}</Link> : field.label}</th>)}
        </tr></thead><tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {records.map((item) => <tr key={item.id}>{fields.map((field, index) => <td key={field.name} className="min-w-32 px-4 py-4">{index === 0 && (item.values[field.name] === null || typeof item.values[field.name] !== "object") ? <Link href={item.url} className="font-medium underline underline-offset-4"><Value value={item.values[field.name]} /></Link> : <Value value={item.values[field.name]} />}</td>)}</tr>)}
          {!records.length && <tr><td colSpan={fields.length} className="p-10 text-center text-neutral-500">No records found.</td></tr>}
        </tbody></table>
      </div>
      <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 text-sm"><p>{pagination.count} records · Page {pagination.page} of {pagination.pages}</p><div className="flex gap-2">{pagination.previous && <Link href={indexUrl(urls.index, { ...filters, page: pagination.previous }, active_filters)} className={buttonClass}>Previous</Link>}{pagination.next && <Link href={indexUrl(urls.index, { ...filters, page: pagination.next }, active_filters)} className={buttonClass}>Next</Link>}</div></nav>
    </>}
    {mode === "show" && <dl className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">{fields.map((field) => <div key={field.name} className="grid gap-2 p-4 md:grid-cols-[14rem_minmax(0,1fr)]"><dt className="text-sm font-medium">{field.label}</dt><dd className="min-w-0 break-words text-sm"><Value value={record.values[field.name]} /></dd></div>)}</dl>}
    {["new", "edit"].includes(mode) && <ResourceForm key={`${resource.key}-${record.id}-${mode}`} {...props} />}
  </>
}
