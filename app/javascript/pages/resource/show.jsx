import React from "react"
import { Value } from "../../components/field"

// Read-only attribute list for one record.
export default function Show({ fields, record }) {
  return <dl className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">{fields.map((field) => <div key={field.name} className="grid gap-2 p-4 md:grid-cols-[14rem_minmax(0,1fr)]"><dt className="text-sm font-medium">{field.label}</dt><dd className="min-w-0 break-words text-sm"><Value value={record.values[field.name]} /></dd></div>)}</dl>
}
