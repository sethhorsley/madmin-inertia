import React, { useEffect, useRef, useState } from "react"
import { Link } from "@inertiajs/react"
import { buttonClass, inputClass } from "../lib/ui"

export function Value({ value }) {
  if (value === null || value === undefined || value === "") return <span className="text-neutral-500">—</span>
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (value.error) return <span className="text-red-600 dark:text-red-400">{value.error}</span>
  if (value.html !== undefined) return <div className="trix-content prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: value.html }} />
  if (value.links) return <div className="space-y-1">
    {value.links.map((item, index) => <div key={`${item.url}-${index}`}>{item.url ? (item.external ? <a href={item.url} className="underline underline-offset-4">{item.label}</a> : <Link href={item.url} className="underline underline-offset-4">{item.label}</Link>) : item.label}</div>)}
    {!value.links.length && <span className="text-neutral-500">—</span>}
    <div className="flex gap-3">{value.previous_url && <Link href={value.previous_url} preserveScroll className="underline">Previous</Link>}{value.next_url && <Link href={value.next_url} preserveScroll className="underline">Next</Link>}</div>
  </div>
  return typeof value === "object" ? <pre className="max-w-xl overflow-auto whitespace-pre-wrap break-words text-xs">{JSON.stringify(value, null, 2)}</pre> : String(value)
}

function Association({ field, value, onChange, id }) {
  const [options, setOptions] = useState(field.options || [])
  const [query, setQuery] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const pending = useRef(null)
  useEffect(() => () => pending.current?.abort(), [])
  async function search() {
    pending.current?.abort()
    const controller = new AbortController()
    pending.current = controller
    setLoading(true)
    setError("")
    try {
      const url = new URL(field.lookup, window.location.origin)
      url.searchParams.set("q", query)
      const response = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal })
      if (!response.ok) throw new Error("Could not load options.")
      const records = await response.json()
      setOptions((current) => [...new Map([...current, ...records.map((record) => ({ label: record.name, value: String(record.id) }))].map((option) => [option.value, option])).values()])
    } catch (failure) {
      if (failure.name !== "AbortError") setError(failure.message)
    } finally {
      if (pending.current === controller) setLoading(false)
    }
  }
  const multiple = field.type === "has_many"
  return <div className="space-y-2">
    {field.lookup && <div className="flex gap-2"><input aria-label={`Search ${field.label}`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} className={inputClass} /><button type="button" onClick={search} disabled={loading} className={buttonClass}>{loading ? "Loading…" : "Find"}</button></div>}
    {error && <p role="alert" className="text-red-600 dark:text-red-400">{error}</p>}
    <select id={id} multiple={multiple} required={field.required} value={value || (multiple ? [] : "")} onChange={(event) => onChange(multiple ? Array.from(event.target.selectedOptions, (option) => option.value) : event.target.value)} className={inputClass}>
      {!multiple && <option value="">Select…</option>}
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    {multiple && <p className="text-xs text-neutral-500">Use Command or Control to select multiple records.</p>}
  </div>
}

function RichText({ id, value, onChange, uploads }) {
  const editor = useRef(null)
  useEffect(() => {
    const element = editor.current
    const change = () => onChange(element.value)
    element.addEventListener("trix-change", change)
    return () => element.removeEventListener("trix-change", change)
  }, [onChange])
  return <><input id={`${id}-value`} type="hidden" value={value || ""} /><trix-editor ref={editor} id={id} input={`${id}-value`} data-direct-upload-url={uploads.direct} data-blob-url-template={uploads.blob} className="trix-content min-h-40 dark:bg-neutral-900" /></>
}

export default function Field({ field, value, onChange, uploads, error }) {
  const id = `field-${field.name}`
  const props = { id, required: field.required, "aria-invalid": !!error, "aria-describedby": error ? `${id}-error` : undefined, className: inputClass }
  let input
  if (field.readonly) input = <Value value={value} />
  else if (field.type === "boolean") input = <select {...props} value={value === null ? "" : String(value)} onChange={(event) => onChange(event.target.value === "" ? null : event.target.value === "true")}><option value="">Not set</option><option value="true">Yes</option><option value="false">No</option></select>
  else if (["belongs_to", "has_many", "polymorphic", "enum", "select"].includes(field.type)) input = <Association field={field} value={value} onChange={onChange} id={id} />
  else if (field.type === "rich_text") input = <RichText id={id} value={value} onChange={onChange} uploads={uploads} />
  else if (["attachment", "attachments", "file"].includes(field.type)) input = <><input {...props} required={field.required && !value?.links?.length} type="file" multiple={field.type === "attachments"} onChange={(event) => onChange(field.type === "attachments" ? Array.from(event.target.files) : event.target.files[0])} />{value?.links && <Value value={value} />}</>
  else if (["json", "text"].includes(field.type)) input = <textarea {...props} rows={6} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
  else {
    const type = ({ date_time: "datetime-local", datetime: "datetime-local", integer: "number", decimal: "number", float: "number", currency: "number", date: "date", time: "time", password: "password" })[field.type] || "text"
    input = <input {...props} type={type} step={field.type === "integer" ? "1" : "any"} value={value ?? ""} autoComplete={type === "password" ? "new-password" : undefined} onChange={(event) => onChange(event.target.value)} />
  }
  return <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium">{field.label}{field.required && " *"}{["date_time", "datetime"].includes(field.type) && " (UTC)"}</label>
    {input}
    {field.description && <p className="text-sm text-neutral-500">{field.description}</p>}
    {error && <p id={`${id}-error`} role="alert" className="text-sm text-red-600 dark:text-red-400">{[].concat(error).join(", ")}</p>}
  </div>
}
