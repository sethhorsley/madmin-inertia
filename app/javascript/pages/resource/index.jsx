import React from "react"
import { Link, router } from "@inertiajs/react"
import { Value } from "../../components/field"
import Filters, { indexUrl } from "../../components/filters"
import { buttonClass, inputClass } from "../../lib/ui"

// Search, scopes, filters, sortable table and pagination for a resource.
export default function Index({ resource, fields, records, urls, filters, scopes, pagination, filter_columns, filter_operators, active_filters }) {
  function search(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    router.get(indexUrl(urls.index, { ...filters, q: data.get("q"), scope: data.get("scope"), page: null }, active_filters))
  }
  return <>
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
  </>
}
