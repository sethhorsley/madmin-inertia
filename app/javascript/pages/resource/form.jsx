import React from "react"
import { Link, useForm } from "@inertiajs/react"
import Field from "../../components/field"
import { buttonClass } from "../../lib/ui"

// New/edit form; submits as JSON (or multipart for edits) and shows server-side errors.
export default function Form({ fields, record, resource, mode, urls, uploads, errors }) {
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
