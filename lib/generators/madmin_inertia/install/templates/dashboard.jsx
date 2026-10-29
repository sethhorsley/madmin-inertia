import React from "react"
import { Head, Link } from "@inertiajs/react"

export default function Dashboard({ admin, counts }) {
  return <>
    <Head title={`Dashboard - ${admin.name} Admin`} />
    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
    <div className="grid gap-4 sm:grid-cols-3">
      {counts.map((count) => <Link key={count.label} href={count.url} className="rounded-xl border border-neutral-200 p-4 hover:bg-neutral-50">
        <p className="text-sm text-neutral-500">{count.label}</p>
        <p className="text-3xl font-semibold">{count.value}</p>
      </Link>)}
    </div>
  </>
}
