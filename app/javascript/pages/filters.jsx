import React, { useState } from "react"
import { router } from "@inertiajs/react"
import { buttonClass, inputClass } from "./ui"

const INPUT_TYPES = { number: "number", date: "date", datetime: "datetime-local" }

// Builds the index URL; filters use the gem's `filters[][column]` param shape, which Rails groups into an array.
export function indexUrl(base, params, filters) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => value && query.append(key, value))
  filters.forEach(({ column, operator, value }) => {
    query.append("filters[][column]", column)
    query.append("filters[][operator]", operator)
    query.append("filters[][value]", value || "")
  })
  const string = query.toString()
  return string ? `${base}?${string}` : base
}

// shadcn-style filter builder: a popover of column / operator / value rows plus removable badges for the active ones.
export default function Filters({ urls, params, columns, operators, active }) {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState(active)
  if (!columns.length) return null
  const columnFor = (name) => columns.find((column) => column.name === name) || columns[0]
  const blank = () => ({ column: columns[0].name, operator: operators[columns[0].type][0].value, value: "" })
  const update = (index, changes) => setRows(rows.map((row, i) => (i === index ? { ...row, ...changes } : row)))
  const apply = (next) => router.get(indexUrl(urls.index, { ...params, page: null }, next))
  const label = (filter) => {
    const column = columnFor(filter.column)
    const operator = operators[column.type].find((item) => item.value === filter.operator)
    return `${column.label} ${operator?.label.toLowerCase()}${operator?.valueless ? "" : ` "${filter.value}"`}`
  }
  const remove = (index) => apply(active.filter((_, i) => i !== index))

  return <div className="relative">
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className={buttonClass} aria-expanded={open} onClick={() => { setRows(active.length ? active : [blank()]); setOpen(!open) }}>
        Filters{active.length > 0 && <span className="ml-2 rounded-full bg-neutral-900 px-2 text-xs text-white dark:bg-neutral-100 dark:text-neutral-900">{active.length}</span>}
      </button>
      {active.map((filter, index) => <span key={index} className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium dark:border-neutral-700">
        {label(filter)}
        <button type="button" aria-label={`Remove filter ${label(filter)}`} className="text-neutral-500 hover:text-current" onClick={() => remove(index)}>&times;</button>
      </span>)}
      {active.length > 0 && <button type="button" className="text-xs underline" onClick={() => apply([])}>Clear all</button>}
    </div>
    {open && <form
      onSubmit={(event) => { event.preventDefault(); setOpen(false); apply(rows) }}
      className="absolute left-0 z-20 mt-2 w-[min(42rem,calc(100vw-2rem))] space-y-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-sm font-semibold">Show records where</p>
      {rows.map((row, index) => {
        const column = columnFor(row.column)
        const operator = operators[column.type].find((item) => item.value === row.operator)
        return <div key={index} className="grid grid-cols-[1fr_1fr] gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <select aria-label="Column" className={inputClass} value={row.column} onChange={(event) => {
            const next = columnFor(event.target.value)
            update(index, { column: next.name, operator: operators[next.type][0].value, value: "" })
          }}>{columns.map((item) => <option key={item.name} value={item.name}>{item.label}</option>)}</select>
          <select aria-label="Operator" className={inputClass} value={row.operator} onChange={(event) => update(index, { operator: event.target.value })}>
            {operators[column.type].map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          {operator?.valueless ? <span className="hidden sm:block" /> : <input aria-label="Value" className={inputClass} type={INPUT_TYPES[column.type] || "text"} step={column.type === "number" ? "any" : undefined} value={row.value} onChange={(event) => update(index, { value: event.target.value })} autoFocus={index === rows.length - 1} />}
          <button type="button" aria-label="Remove row" className="px-2 text-neutral-500 hover:text-current" onClick={() => setRows(rows.filter((_, i) => i !== index))}>&times;</button>
        </div>
      })}
      <div className="flex justify-between gap-2">
        <button type="button" className={buttonClass} onClick={() => setRows([...rows, blank()])}>Add filter</button>
        <button type="submit" className="inline-flex items-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900">Apply</button>
      </div>
    </form>}
  </div>
}
