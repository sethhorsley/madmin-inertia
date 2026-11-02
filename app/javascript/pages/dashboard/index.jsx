import React, { useMemo, useState } from "react"
import { Head, Link } from "@inertiajs/react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "#ui/chart"

const config = {
  views: { label: "Records" },
  created: { label: "Created", color: "var(--chart-2)" },
  updated: { label: "Updated", color: "var(--chart-1)" },
}
const day = (value, options) => new Date(`${value}T00:00:00`).toLocaleDateString("en-US", options)

function ActivityChart({ chart }) {
  const [active, setActive] = useState("created")
  const total = useMemo(() => ({
    created: chart.data.reduce((sum, row) => sum + row.created, 0),
    updated: chart.data.reduce((sum, row) => sum + row.updated, 0),
  }), [chart])

  return <Card className="py-0">
    <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
      <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
        <CardTitle>{chart.label}</CardTitle>
        <CardDescription>Activity over the last {chart.data.length} days</CardDescription>
      </div>
      <div className="flex">
        {Object.keys(total).map((key) => <button key={key} type="button" data-active={active === key} onClick={() => setActive(key)} className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
          <span className="text-xs text-muted-foreground">{config[key].label}</span>
          <span className="text-lg leading-none font-bold sm:text-3xl">{total[key].toLocaleString()}</span>
        </button>)}
      </div>
    </CardHeader>
    <CardContent className="px-2 sm:p-6">
      <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
        <BarChart accessibilityLayer data={chart.data} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={(value) => day(value, { month: "short", day: "numeric" })} />
          <ChartTooltip content={<ChartTooltipContent className="w-[150px]" nameKey="views" labelFormatter={(value) => day(value, { month: "short", day: "numeric", year: "numeric" })} />} />
          <Bar dataKey={active} fill={`var(--color-${active})`} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
}

export default function Dashboard({ admin, counts, chart }) {
  return <>
    <Head title={`Dashboard - ${admin.name} Admin`} />
    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
    <div className="grid gap-4 sm:grid-cols-3">
      {counts.map((count) => <Link key={count.label} href={count.url} className="rounded-xl border bg-card p-4 text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
        <p className="text-sm text-muted-foreground">{count.label}</p>
        <p className="text-3xl font-semibold">{count.value}</p>
      </Link>)}
    </div>
    {chart && <ActivityChart chart={chart} />}
  </>
}
