// ../index.jsx
import React25 from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";

// ../app/javascript/pages/dashboard/index.jsx
import React3, { useMemo as useMemo2, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// ../app/javascript/components/ui/card.jsx
import * as React from "react";

// ../app/javascript/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ../app/javascript/components/ui/card.jsx
import { jsx } from "react/jsx-runtime";
function Card({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
}
function CardAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-action",
      className: cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      ),
      ...props
    }
  );
}
function CardContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function CardFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: cn("flex items-center px-6 [.border-t]:pt-6", className),
      ...props
    }
  );
}

// ../app/javascript/components/ui/chart.jsx
import * as React2 from "react";
import * as RechartsPrimitive from "recharts";
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
var THEMES = {
  light: "",
  dark: ".dark"
};
var INITIAL_DIMENSION = {
  width: 320,
  height: 200
};
var ChartContext = React2.createContext(null);
function useChart() {
  const context = React2.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}
function ChartContainer({
  id,
  className,
  children,
  config: config2,
  initialDimension = INITIAL_DIMENSION,
  ...props
}) {
  const uniqueId = React2.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;
  return /* @__PURE__ */ jsx2(ChartContext.Provider, { value: { config: config2 }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "chart",
      "data-chart": chartId,
      className: cn(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx2(ChartStyle, { id: chartId, config: config2 }),
        /* @__PURE__ */ jsx2(
          RechartsPrimitive.ResponsiveContainer,
          {
            initialDimension,
            children
          }
        )
      ]
    }
  ) });
}
var ChartStyle = ({
  id,
  config: config2
}) => {
  const colorConfig = Object.entries(config2).filter(
    ([, config3]) => config3.theme ?? config3.color
  );
  if (!colorConfig.length) {
    return null;
  }
  return /* @__PURE__ */ jsx2(
    "style",
    {
      dangerouslySetInnerHTML: {
        __html: Object.entries(THEMES).map(
          ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
            const color = itemConfig.theme?.[theme] ?? itemConfig.color;
            return color ? `  --color-${key}: ${color};` : null;
          }).join("\n")}
}
`
        ).join("\n")
      }
    }
  );
};
var ChartTooltip = RechartsPrimitive.Tooltip;
function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey
}) {
  const { config: config2 } = useChart();
  const tooltipLabel = React2.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }
    const [item] = payload;
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config2, item, key);
    const value = !labelKey && typeof label === "string" ? config2[label]?.label ?? label : itemConfig?.label;
    if (labelFormatter) {
      return /* @__PURE__ */ jsx2("div", { className: cn("font-medium", labelClassName), children: labelFormatter(value, payload) });
    }
    if (!value) {
      return null;
    }
    return /* @__PURE__ */ jsx2("div", { className: cn("font-medium", labelClassName), children: value });
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config2,
    labelKey
  ]);
  if (!active || !payload?.length) {
    return null;
  }
  const nestLabel = payload.length === 1 && indicator !== "dot";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      ),
      children: [
        !nestLabel ? tooltipLabel : null,
        /* @__PURE__ */ jsx2("div", { className: "grid gap-1.5", children: payload.filter((item) => item.type !== "none").map((item, index) => {
          const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config2, item, key);
          const indicatorColor = color ?? item.payload?.fill ?? item.color;
          return /* @__PURE__ */ jsx2(
            "div",
            {
              className: cn(
                "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                indicator === "dot" && "items-center"
              ),
              children: formatter && item?.value !== void 0 && item.name ? formatter(item.value, item.name, item, index, item.payload) : /* @__PURE__ */ jsxs(Fragment, { children: [
                itemConfig?.icon ? /* @__PURE__ */ jsx2(itemConfig.icon, {}) : !hideIndicator && /* @__PURE__ */ jsx2(
                  "div",
                  {
                    className: cn(
                      "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                      {
                        "h-2.5 w-2.5": indicator === "dot",
                        "w-1": indicator === "line",
                        "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                        "my-0.5": nestLabel && indicator === "dashed"
                      }
                    ),
                    style: {
                      "--color-bg": indicatorColor,
                      "--color-border": indicatorColor
                    }
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center"
                    ),
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
                        nestLabel ? tooltipLabel : null,
                        /* @__PURE__ */ jsx2("span", { className: "text-muted-foreground", children: itemConfig?.label ?? item.name })
                      ] }),
                      item.value != null && /* @__PURE__ */ jsx2("span", { className: "font-mono font-medium text-foreground tabular-nums", children: typeof item.value === "number" ? item.value.toLocaleString() : String(item.value) })
                    ]
                  }
                )
              ] })
            },
            index
          );
        }) })
      ]
    }
  );
}
var ChartLegend = RechartsPrimitive.Legend;
function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey
}) {
  const { config: config2 } = useChart();
  if (!payload?.length) {
    return null;
  }
  return /* @__PURE__ */ jsx2(
    "div",
    {
      className: cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      ),
      children: payload.filter((item) => item.type !== "none").map((item, index) => {
        const key = `${nameKey ?? item.dataKey ?? "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config2, item, key);
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn(
              "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            ),
            children: [
              itemConfig?.icon && !hideIcon ? /* @__PURE__ */ jsx2(itemConfig.icon, {}) : /* @__PURE__ */ jsx2(
                "div",
                {
                  className: "h-2 w-2 shrink-0 rounded-[2px]",
                  style: {
                    backgroundColor: item.color
                  }
                }
              ),
              itemConfig?.label
            ]
          },
          index
        );
      })
    }
  );
}
function getPayloadConfigFromPayload(config2, payload, key) {
  if (typeof payload !== "object" || payload === null) {
    return void 0;
  }
  const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : void 0;
  let configLabelKey = key;
  if (key in payload && typeof payload[key] === "string") {
    configLabelKey = payload[key];
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
    configLabelKey = payloadPayload[key];
  }
  return configLabelKey in config2 ? config2[configLabelKey] : config2[key];
}

// ../app/javascript/pages/dashboard/index.jsx
import { Fragment as Fragment2, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var config = {
  views: { label: "Records" },
  created: { label: "Created", color: "var(--chart-2)" },
  updated: { label: "Updated", color: "var(--chart-1)" }
};
var day = (value, options) => (/* @__PURE__ */ new Date(`${value}T00:00:00`)).toLocaleDateString("en-US", options);
function ActivityChart({ chart }) {
  const [active, setActive] = useState("created");
  const total = useMemo2(() => ({
    created: chart.data.reduce((sum, row) => sum + row.created, 0),
    updated: chart.data.reduce((sum, row) => sum + row.updated, 0)
  }), [chart]);
  return /* @__PURE__ */ jsxs2(Card, { className: "py-0", children: [
    /* @__PURE__ */ jsxs2(CardHeader, { className: "flex flex-col items-stretch border-b p-0! sm:flex-row", children: [
      /* @__PURE__ */ jsxs2("div", { className: "flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!", children: [
        /* @__PURE__ */ jsx3(CardTitle, { children: chart.label }),
        /* @__PURE__ */ jsxs2(CardDescription, { children: [
          "Activity over the last ",
          chart.data.length,
          " days"
        ] })
      ] }),
      /* @__PURE__ */ jsx3("div", { className: "flex", children: Object.keys(total).map((key) => /* @__PURE__ */ jsxs2("button", { type: "button", "data-active": active === key, onClick: () => setActive(key), className: "relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6", children: [
        /* @__PURE__ */ jsx3("span", { className: "text-xs text-muted-foreground", children: config[key].label }),
        /* @__PURE__ */ jsx3("span", { className: "text-lg leading-none font-bold sm:text-3xl", children: total[key].toLocaleString() })
      ] }, key)) })
    ] }),
    /* @__PURE__ */ jsx3(CardContent, { className: "px-2 sm:p-6", children: /* @__PURE__ */ jsx3(ChartContainer, { config, className: "aspect-auto h-[250px] w-full", children: /* @__PURE__ */ jsxs2(BarChart, { accessibilityLayer: true, data: chart.data, margin: { left: 12, right: 12 }, children: [
      /* @__PURE__ */ jsx3(CartesianGrid, { vertical: false }),
      /* @__PURE__ */ jsx3(XAxis, { dataKey: "date", tickLine: false, axisLine: false, tickMargin: 8, minTickGap: 32, tickFormatter: (value) => day(value, { month: "short", day: "numeric" }) }),
      /* @__PURE__ */ jsx3(ChartTooltip, { content: /* @__PURE__ */ jsx3(ChartTooltipContent, { className: "w-[150px]", nameKey: "views", labelFormatter: (value) => day(value, { month: "short", day: "numeric", year: "numeric" }) }) }),
      /* @__PURE__ */ jsx3(Bar, { dataKey: active, fill: `var(--color-${active})` })
    ] }) }) })
  ] });
}
function Dashboard({ admin, counts, chart }) {
  return /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx3(Head, { title: `Dashboard - ${admin.name} Admin` }),
    /* @__PURE__ */ jsx3("h1", { className: "text-2xl font-semibold tracking-tight", children: "Dashboard" }),
    /* @__PURE__ */ jsx3("div", { className: "grid gap-4 sm:grid-cols-3", children: counts.map((count) => /* @__PURE__ */ jsxs2(Link, { href: count.url, className: "rounded-xl border bg-card p-4 text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground", children: [
      /* @__PURE__ */ jsx3("p", { className: "text-sm text-muted-foreground", children: count.label }),
      /* @__PURE__ */ jsx3("p", { className: "text-3xl font-semibold", children: count.value })
    ] }, count.label)) }),
    chart && /* @__PURE__ */ jsx3(ActivityChart, { chart })
  ] });
}

// ../app/javascript/layouts/admin-layout.jsx
import React17 from "react";
import { usePage } from "@inertiajs/react";

// ../app/javascript/components/admin-sidebar.jsx
import React13, { useState as useState4 } from "react";
import { Link as Link2 } from "@inertiajs/react";
import { ChevronRight, ChevronsUpDown, Folder, LayoutDashboard, LogOut, Settings, ShieldCheck, User } from "lucide-react";

// ../app/javascript/lib/navigation.js
var isActive = (item, path, dashboard) => Boolean(item.url) && item.url !== dashboard && (path === item.url || path.startsWith(`${item.url}/`));
function trail(navigation, path, dashboard) {
  const active = (item) => isActive(item, path, dashboard);
  for (const item of navigation) {
    const child = item.children.find(active);
    if (child) return [item, child];
    if (active(item)) return [item];
  }
  return [];
}

// ../app/javascript/lib/sidebar-variant.js
import { useSyncExternalStore } from "react";
var KEY = "madmin-sidebar-variant";
var listeners = /* @__PURE__ */ new Set();
var getSidebarVariant = () => {
  try {
    return localStorage.getItem(KEY) === "sidebar" ? "sidebar" : "inset";
  } catch {
    return "inset";
  }
};
function setSidebarVariant(variant) {
  try {
    localStorage.setItem(KEY, variant);
  } catch {
  }
  listeners.forEach((listener) => listener());
}
var subscribe = (listener) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};
var useSidebarVariant = () => useSyncExternalStore(subscribe, getSidebarVariant);

// ../app/javascript/components/ui/avatar.jsx
import * as React4 from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { jsx as jsx4 } from "react/jsx-runtime";
function Avatar({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx4(
    AvatarPrimitive.Root,
    {
      "data-slot": "avatar",
      "data-size": size,
      className: cn(
        "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6",
        className
      ),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx4(
    AvatarPrimitive.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      ),
      ...props
    }
  );
}

// ../app/javascript/components/ui/collapsible.jsx
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { jsx as jsx5 } from "react/jsx-runtime";
function Collapsible({
  ...props
}) {
  return /* @__PURE__ */ jsx5(CollapsiblePrimitive.Root, { "data-slot": "collapsible", ...props });
}
function CollapsibleTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx5(
    CollapsiblePrimitive.CollapsibleTrigger,
    {
      "data-slot": "collapsible-trigger",
      ...props
    }
  );
}
function CollapsibleContent({
  ...props
}) {
  return /* @__PURE__ */ jsx5(
    CollapsiblePrimitive.CollapsibleContent,
    {
      "data-slot": "collapsible-content",
      ...props
    }
  );
}

// ../app/javascript/components/ui/dropdown-menu.jsx
import * as React5 from "react";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx6(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx6(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx6(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx6(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx6(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuRadioGroup({
  ...props
}) {
  return /* @__PURE__ */ jsx6(
    DropdownMenuPrimitive.RadioGroup,
    {
      "data-slot": "dropdown-menu-radio-group",
      ...props
    }
  );
}
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs3(
    DropdownMenuPrimitive.RadioItem,
    {
      "data-slot": "dropdown-menu-radio-item",
      className: cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx6("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx6(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx6(CircleIcon, { className: "size-2 fill-current" }) }) }),
        children
      ]
    }
  );
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsx6(
    DropdownMenuPrimitive.Label,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx6(
    DropdownMenuPrimitive.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("-mx-1 my-1 h-px bg-border", className),
      ...props
    }
  );
}

// ../app/javascript/components/ui/input.jsx
import * as React6 from "react";
import { jsx as jsx7 } from "react/jsx-runtime";
function Input({
  className,
  type,
  ...props
}) {
  return /* @__PURE__ */ jsx7(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}

// ../app/javascript/components/ui/sidebar.jsx
import * as React12 from "react";
import { cva as cva2 } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";
import { Slot as Slot2 } from "radix-ui";

// ../app/javascript/hooks/use-mobile.js
import * as React7 from "react";
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React7.useState(void 0);
  React7.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}

// ../app/javascript/components/ui/button.jsx
import * as React8 from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";
import { jsx as jsx8 } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";
  return /* @__PURE__ */ jsx8(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// ../app/javascript/components/ui/separator.jsx
import * as React9 from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";
import { jsx as jsx9 } from "react/jsx-runtime";
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx9(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}

// ../app/javascript/components/ui/sheet.jsx
import * as React10 from "react";
import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { jsx as jsx10, jsxs as jsxs4 } from "react/jsx-runtime";
function Sheet({
  ...props
}) {
  return /* @__PURE__ */ jsx10(SheetPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx10(SheetPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx10(
    SheetPrimitive.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs4(SheetPortal, { children: [
    /* @__PURE__ */ jsx10(SheetOverlay, {}),
    /* @__PURE__ */ jsxs4(
      SheetPrimitive.Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500",
          side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
          side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
          side === "top" && "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          side === "bottom" && "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs4(SheetPrimitive.Close, { className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
            /* @__PURE__ */ jsx10(XIcon, { className: "size-4" }),
            /* @__PURE__ */ jsx10("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx10(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx10(
    SheetPrimitive.Title,
    {
      "data-slot": "sheet-title",
      className: cn("font-semibold text-foreground", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx10(
    SheetPrimitive.Description,
    {
      "data-slot": "sheet-description",
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
}

// ../app/javascript/components/ui/skeleton.jsx
import { jsx as jsx11 } from "react/jsx-runtime";
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx11(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("animate-pulse rounded-md bg-accent", className),
      ...props
    }
  );
}

// ../app/javascript/components/ui/tooltip.jsx
import * as React11 from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { jsx as jsx12, jsxs as jsxs5 } from "react/jsx-runtime";
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx12(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip2({
  ...props
}) {
  return /* @__PURE__ */ jsx12(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx12(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx12(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs5(
    TooltipPrimitive.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx12(TooltipPrimitive.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" })
      ]
    }
  ) });
}

// ../app/javascript/components/ui/sidebar.jsx
import { jsx as jsx13, jsxs as jsxs6 } from "react/jsx-runtime";
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React12.createContext(null);
function useSidebar() {
  const context = React12.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React12.useState(false);
  const [_open, _setOpen] = React12.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React12.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );
  const toggleSidebar = React12.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  React12.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = React12.useMemo(() => ({
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar
  }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]);
  return /* @__PURE__ */ jsx13(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx13(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style
      },
      className: cn(
        "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
        className
      ),
      ...props,
      children
    }
  ) }) });
}
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsx13(
      "div",
      {
        "data-slot": "sidebar",
        className: cn(
          "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
          className
        ),
        ...props,
        children
      }
    );
  }
  if (isMobile) {
    return /* @__PURE__ */ jsx13(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxs6(
      SheetContent,
      {
        "data-sidebar": "sidebar",
        "data-slot": "sidebar",
        "data-mobile": "true",
        className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side,
        children: [
          /* @__PURE__ */ jsxs6(SheetHeader, { className: "sr-only", children: [
            /* @__PURE__ */ jsx13(SheetTitle, { children: "Sidebar" }),
            /* @__PURE__ */ jsx13(SheetDescription, { children: "Displays the mobile sidebar." })
          ] }),
          /* @__PURE__ */ jsx13("div", { className: "flex h-full w-full flex-col", children })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      className: "group peer hidden text-sidebar-foreground md:block",
      "data-state": state,
      "data-collapsible": state === "collapsed" ? collapsible : "",
      "data-variant": variant,
      "data-side": side,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ jsx13(
          "div",
          {
            "data-slot": "sidebar-gap",
            className: cn(
              "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }
        ),
        /* @__PURE__ */ jsx13(
          "div",
          {
            "data-slot": "sidebar-container",
            className: cn(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
              side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              className
            ),
            ...props,
            children: /* @__PURE__ */ jsx13(
              "div",
              {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar-inner",
                className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm",
                children
              }
            )
          }
        )
      ]
    }
  );
}
function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxs6(
    Button,
    {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      className: cn("size-7", className),
      onClick: (event) => {
        onClick?.(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx13(PanelLeftIcon, {}),
        /* @__PURE__ */ jsx13("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
}
function SidebarRail({
  className,
  ...props
}) {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx13(
    "button",
    {
      "data-sidebar": "rail",
      "data-slot": "sidebar-rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: toggleSidebar,
      title: "Toggle Sidebar",
      className: cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      ),
      ...props
    }
  );
}
function SidebarInset({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    "main",
    {
      "data-slot": "sidebar-inset",
      className: cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      ),
      ...props
    }
  );
}
function SidebarInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    Input,
    {
      "data-slot": "sidebar-input",
      "data-sidebar": "input",
      className: cn("h-8 w-full bg-background shadow-none", className),
      ...props
    }
  );
}
function SidebarHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    Separator,
    {
      "data-slot": "sidebar-separator",
      "data-sidebar": "separator",
      className: cn("mx-2 w-auto bg-sidebar-border", className),
      ...props
    }
  );
}
function SidebarContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
}
function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot2.Root : "div";
  return /* @__PURE__ */ jsx13(
    Comp,
    {
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      className: cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
}
function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot2.Root : "button";
  return /* @__PURE__ */ jsx13(
    Comp,
    {
      "data-slot": "sidebar-group-action",
      "data-sidebar": "group-action",
      className: cn(
        "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarGroupContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      className: cn("w-full text-sm", className),
      ...props
    }
  );
}
function SidebarMenu({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    "ul",
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: cn("flex w-full min-w-0 flex-col gap-1", className),
      ...props
    }
  );
}
function SidebarMenuItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    "li",
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: cn("group/menu-item relative", className),
      ...props
    }
  );
}
var sidebarMenuButtonVariants = cva2(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function SidebarMenuButton({
  asChild = false,
  isActive: isActive2 = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const Comp = asChild ? Slot2.Root : "button";
  const { isMobile, state } = useSidebar();
  const button = /* @__PURE__ */ jsx13(
    Comp,
    {
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive2,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...props
    }
  );
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /* @__PURE__ */ jsxs6(Tooltip2, { children: [
    /* @__PURE__ */ jsx13(TooltipTrigger, { asChild: true, children: button }),
    /* @__PURE__ */ jsx13(
      TooltipContent,
      {
        side: "right",
        align: "center",
        hidden: state !== "collapsed" || isMobile,
        ...tooltip
      }
    )
  ] });
}
function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}) {
  const Comp = asChild ? Slot2.Root : "button";
  return /* @__PURE__ */ jsx13(
    Comp,
    {
      "data-slot": "sidebar-menu-action",
      "data-sidebar": "menu-action",
      className: cn(
        "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0",
        className
      ),
      ...props
    }
  );
}
function SidebarMenuBadge({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "sidebar-menu-badge",
      "data-sidebar": "menu-badge",
      className: cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}) {
  const width = React12.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      "data-slot": "sidebar-menu-skeleton",
      "data-sidebar": "menu-skeleton",
      className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
      ...props,
      children: [
        showIcon && /* @__PURE__ */ jsx13(
          Skeleton,
          {
            className: "size-4 rounded-md",
            "data-sidebar": "menu-skeleton-icon"
          }
        ),
        /* @__PURE__ */ jsx13(
          Skeleton,
          {
            className: "h-4 max-w-(--skeleton-width) flex-1",
            "data-sidebar": "menu-skeleton-text",
            style: {
              "--skeleton-width": width
            }
          }
        )
      ]
    }
  );
}
function SidebarMenuSub({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    "ul",
    {
      "data-slot": "sidebar-menu-sub",
      "data-sidebar": "menu-sub",
      className: cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarMenuSubItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    "li",
    {
      "data-slot": "sidebar-menu-sub-item",
      "data-sidebar": "menu-sub-item",
      className: cn("group/menu-sub-item relative", className),
      ...props
    }
  );
}
function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive: isActive2 = false,
  className,
  ...props
}) {
  const Comp = asChild ? Slot2.Root : "a";
  return /* @__PURE__ */ jsx13(
    Comp,
    {
      "data-slot": "sidebar-menu-sub-button",
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive2,
      className: cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
}

// ../app/javascript/components/admin-sidebar.jsx
import { Fragment as Fragment3, jsx as jsx14, jsxs as jsxs7 } from "react/jsx-runtime";
function namespaced(children) {
  const entries = [];
  const parents = {};
  for (const child of children) {
    const [parent, ...rest] = child.label.split(" / ");
    if (!rest.length) {
      entries.push(child);
      continue;
    }
    if (!parents[parent]) {
      parents[parent] = { label: parent, children: [] };
      entries.push(parents[parent]);
    }
    parents[parent].children.push({ ...child, label: rest.join(" - ") });
  }
  return entries;
}
function NavLink({ admin, item, children, ...props }) {
  return item.url?.startsWith(admin.dashboard) ? /* @__PURE__ */ jsx14(Link2, { href: item.url, ...props, children }) : /* @__PURE__ */ jsx14("a", { href: item.url || "#", ...props, children });
}
function Leaf({ admin, item, active }) {
  return /* @__PURE__ */ jsx14(SidebarMenuSubItem, { children: /* @__PURE__ */ jsx14(SidebarMenuSubButton, { asChild: true, isActive: active, children: /* @__PURE__ */ jsx14(NavLink, { admin, item, children: /* @__PURE__ */ jsx14("span", { children: item.label }) }) }) });
}
function Namespace({ admin, entry, active, forceOpen }) {
  return /* @__PURE__ */ jsx14(Collapsible, { defaultOpen: entry.children.some(active), open: forceOpen || void 0, asChild: true, className: "group/namespace", children: /* @__PURE__ */ jsxs7(SidebarMenuSubItem, { children: [
    /* @__PURE__ */ jsx14(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxs7(SidebarMenuSubButton, { className: "w-full cursor-pointer", children: [
      /* @__PURE__ */ jsx14("span", { children: entry.label }),
      /* @__PURE__ */ jsx14(ChevronRight, { className: "ml-auto transition-transform duration-200 group-data-[state=open]/namespace:rotate-90" })
    ] }) }),
    /* @__PURE__ */ jsx14(CollapsibleContent, { children: /* @__PURE__ */ jsx14(SidebarMenuSub, { children: entry.children.map((child) => /* @__PURE__ */ jsx14(Leaf, { admin, item: child, active: active(child) }, child.url)) }) })
  ] }) });
}
function Section({ admin, item, active, forceOpen }) {
  const { open, setOpen } = useSidebar();
  const [expanded, setExpanded] = useState4(item.children.some(active));
  return /* @__PURE__ */ jsx14(Collapsible, { asChild: true, open: expanded || forceOpen, onOpenChange: (value) => {
    if (!open) setOpen(true);
    setExpanded(value);
  }, className: "group/collapsible", children: /* @__PURE__ */ jsxs7(SidebarMenuItem, { children: [
    /* @__PURE__ */ jsx14(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxs7(SidebarMenuButton, { tooltip: item.label, children: [
      /* @__PURE__ */ jsx14(Folder, {}),
      /* @__PURE__ */ jsx14("span", { children: item.label }),
      /* @__PURE__ */ jsx14(ChevronRight, { className: "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" })
    ] }) }),
    /* @__PURE__ */ jsx14(CollapsibleContent, { children: /* @__PURE__ */ jsx14(SidebarMenuSub, { children: namespaced(item.children).map((entry) => entry.children ? /* @__PURE__ */ jsx14(Namespace, { admin, entry, active, forceOpen }, entry.label) : /* @__PURE__ */ jsx14(Leaf, { admin, item: entry, active: active(entry) }, entry.url)) }) })
  ] }) });
}
function NavUser({ admin }) {
  const { isMobile } = useSidebar();
  const { user, logout } = admin;
  const token = document.querySelector('meta[name="csrf-token"]')?.content;
  const name = user?.name || "Profile";
  return /* @__PURE__ */ jsx14(SidebarMenu, { children: /* @__PURE__ */ jsx14(SidebarMenuItem, { children: /* @__PURE__ */ jsxs7(DropdownMenu, { children: [
    /* @__PURE__ */ jsx14(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs7(SidebarMenuButton, { size: "lg", className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground", children: [
      /* @__PURE__ */ jsx14(Avatar, { className: "h-8 w-8 rounded-lg", children: /* @__PURE__ */ jsx14(AvatarFallback, { className: "rounded-lg", children: user ? name.slice(0, 2).toUpperCase() : /* @__PURE__ */ jsx14(User, { className: "size-4" }) }) }),
      /* @__PURE__ */ jsxs7("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
        /* @__PURE__ */ jsx14("span", { className: "truncate font-medium", children: name }),
        user?.email && /* @__PURE__ */ jsx14("span", { className: "truncate text-xs", children: user.email })
      ] }),
      /* @__PURE__ */ jsx14(ChevronsUpDown, { className: "ml-auto size-4" })
    ] }) }),
    /* @__PURE__ */ jsxs7(DropdownMenuContent, { className: "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg", side: isMobile ? "bottom" : "right", align: "end", sideOffset: 4, children: [
      user && /* @__PURE__ */ jsxs7(Fragment3, { children: [
        /* @__PURE__ */ jsx14(DropdownMenuLabel, { className: "font-normal", children: /* @__PURE__ */ jsxs7("div", { className: "grid text-sm leading-tight", children: [
          /* @__PURE__ */ jsx14("span", { className: "truncate font-medium", children: user.name }),
          /* @__PURE__ */ jsx14("span", { className: "truncate text-xs text-muted-foreground", children: user.email })
        ] }) }),
        /* @__PURE__ */ jsx14(DropdownMenuSeparator, {})
      ] }),
      /* @__PURE__ */ jsx14(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs7(Link2, { href: admin.settings, children: [
        /* @__PURE__ */ jsx14(Settings, {}),
        "Settings"
      ] }) }),
      user && logout && /* @__PURE__ */ jsxs7(Fragment3, { children: [
        /* @__PURE__ */ jsx14(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxs7("form", { method: "post", action: logout, children: [
          /* @__PURE__ */ jsx14("input", { type: "hidden", name: "_method", value: "delete" }),
          /* @__PURE__ */ jsx14("input", { type: "hidden", name: "authenticity_token", value: token }),
          /* @__PURE__ */ jsx14(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs7("button", { type: "submit", className: "w-full cursor-pointer", children: [
            /* @__PURE__ */ jsx14(LogOut, {}),
            "Log out"
          ] }) })
        ] })
      ] })
    ] })
  ] }) }) });
}
function AdminSidebar({ admin, path }) {
  const [search, setSearch] = useState4("");
  const variant = useSidebarVariant();
  const active = (item) => isActive(item, path, admin.dashboard);
  const matches = (item) => item.label.toLowerCase().includes(search.toLowerCase());
  const navigation = admin.navigation.filter((item) => matches(item) || item.children.some(matches));
  return /* @__PURE__ */ jsxs7(Sidebar, { variant, collapsible: "icon", children: [
    /* @__PURE__ */ jsxs7(SidebarHeader, { children: [
      /* @__PURE__ */ jsx14(SidebarMenu, { children: /* @__PURE__ */ jsx14(SidebarMenuItem, { children: /* @__PURE__ */ jsx14(SidebarMenuButton, { size: "lg", asChild: true, children: /* @__PURE__ */ jsxs7(Link2, { href: admin.dashboard, children: [
        /* @__PURE__ */ jsx14("div", { className: "flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground", children: /* @__PURE__ */ jsx14(ShieldCheck, { className: "size-4" }) }),
        /* @__PURE__ */ jsxs7("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
          /* @__PURE__ */ jsx14("span", { className: "truncate font-medium", children: admin.name }),
          /* @__PURE__ */ jsx14("span", { className: "truncate text-xs", children: "Admin" })
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsx14(Input, { type: "search", "aria-label": "Find a resource", placeholder: "Find a resource\u2026", value: search, onChange: (event) => setSearch(event.target.value), className: "group-data-[collapsible=icon]:hidden" })
    ] }),
    /* @__PURE__ */ jsx14(SidebarContent, { children: /* @__PURE__ */ jsxs7(SidebarGroup, { children: [
      /* @__PURE__ */ jsx14(SidebarGroupLabel, { children: "Platform" }),
      /* @__PURE__ */ jsxs7(SidebarMenu, { children: [
        /* @__PURE__ */ jsx14(SidebarMenuItem, { children: /* @__PURE__ */ jsx14(SidebarMenuButton, { asChild: true, tooltip: "Dashboard", isActive: path === admin.dashboard, children: /* @__PURE__ */ jsxs7(Link2, { href: admin.dashboard, children: [
          /* @__PURE__ */ jsx14(LayoutDashboard, {}),
          /* @__PURE__ */ jsx14("span", { children: "Dashboard" })
        ] }) }) }),
        navigation.map((item) => item.url ? /* @__PURE__ */ jsx14(SidebarMenuItem, { children: /* @__PURE__ */ jsx14(SidebarMenuButton, { asChild: true, tooltip: item.label, isActive: active(item), children: /* @__PURE__ */ jsxs7(NavLink, { admin, item, children: [
          /* @__PURE__ */ jsx14(Folder, {}),
          /* @__PURE__ */ jsx14("span", { children: item.label })
        ] }) }) }, item.label) : /* @__PURE__ */ jsx14(Section, { admin, item: { ...item, children: item.children.filter((child) => matches(item) || matches(child)) }, active, forceOpen: search !== "" }, item.label))
      ] })
    ] }) }),
    /* @__PURE__ */ jsx14(SidebarFooter, { children: /* @__PURE__ */ jsx14(NavUser, { admin }) }),
    /* @__PURE__ */ jsx14(SidebarRail, {})
  ] });
}

// ../app/javascript/components/breadcrumbs.jsx
import React15 from "react";
import { Link as Link3 } from "@inertiajs/react";

// ../app/javascript/components/ui/breadcrumb.jsx
import * as React14 from "react";
import { ChevronRight as ChevronRight2, MoreHorizontal } from "lucide-react";
import { Slot as Slot3 } from "radix-ui";
import { jsx as jsx15, jsxs as jsxs8 } from "react/jsx-runtime";
function Breadcrumb({
  ...props
}) {
  return /* @__PURE__ */ jsx15("nav", { "aria-label": "breadcrumb", "data-slot": "breadcrumb", ...props });
}
function BreadcrumbList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx15(
    "ol",
    {
      "data-slot": "breadcrumb-list",
      className: cn(
        "flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5",
        className
      ),
      ...props
    }
  );
}
function BreadcrumbItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx15(
    "li",
    {
      "data-slot": "breadcrumb-item",
      className: cn("inline-flex items-center gap-1.5", className),
      ...props
    }
  );
}
function BreadcrumbLink({
  asChild,
  className,
  ...props
}) {
  const Comp = asChild ? Slot3.Root : "a";
  return /* @__PURE__ */ jsx15(
    Comp,
    {
      "data-slot": "breadcrumb-link",
      className: cn("transition-colors hover:text-foreground", className),
      ...props
    }
  );
}
function BreadcrumbPage({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx15(
    "span",
    {
      "data-slot": "breadcrumb-page",
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      className: cn("font-normal text-foreground", className),
      ...props
    }
  );
}
function BreadcrumbSeparator({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx15(
    "li",
    {
      "data-slot": "breadcrumb-separator",
      role: "presentation",
      "aria-hidden": "true",
      className: cn("[&>svg]:size-3.5", className),
      ...props,
      children: children ?? /* @__PURE__ */ jsx15(ChevronRight2, {})
    }
  );
}

// ../app/javascript/components/breadcrumbs.jsx
import { Fragment as Fragment4, jsx as jsx16, jsxs as jsxs9 } from "react/jsx-runtime";
function Breadcrumbs({ admin, path }) {
  const [section, page] = trail(admin.navigation, path, admin.dashboard);
  const current = (page || section)?.label.replaceAll(" / ", " - ") || (path === admin.settings ? "Settings" : "Dashboard");
  return /* @__PURE__ */ jsx16(Breadcrumb, { children: /* @__PURE__ */ jsxs9(BreadcrumbList, { children: [
    /* @__PURE__ */ jsx16(BreadcrumbItem, { className: "hidden md:block", children: /* @__PURE__ */ jsx16(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsxs9(Link3, { href: admin.dashboard, children: [
      admin.name,
      " Admin"
    ] }) }) }),
    section && page && /* @__PURE__ */ jsxs9(Fragment4, { children: [
      /* @__PURE__ */ jsx16(BreadcrumbSeparator, { className: "hidden md:block" }),
      /* @__PURE__ */ jsx16(BreadcrumbItem, { className: "hidden md:block", children: section.label })
    ] }),
    /* @__PURE__ */ jsx16(BreadcrumbSeparator, { className: "hidden md:block" }),
    /* @__PURE__ */ jsx16(BreadcrumbItem, { children: /* @__PURE__ */ jsx16(BreadcrumbPage, { children: current }) })
  ] }) });
}

// ../app/javascript/components/theme-toggle.jsx
import React16 from "react";
import { Monitor, Moon, Sun } from "lucide-react";

// ../app/javascript/lib/theme.js
import { useSyncExternalStore as useSyncExternalStore2 } from "react";
var KEY2 = "madmin-theme";
var listeners2 = /* @__PURE__ */ new Set();
var dark = window.matchMedia("(prefers-color-scheme: dark)");
var getTheme = () => {
  try {
    return localStorage.getItem(KEY2) || "system";
  } catch {
    return "system";
  }
};
function setTheme(theme) {
  try {
    localStorage.setItem(KEY2, theme);
  } catch {
  }
  applyTheme();
  listeners2.forEach((listener) => listener());
}
function applyTheme() {
  const theme = getTheme();
  const isDark = theme === "dark" || theme === "system" && dark.matches;
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}
dark.addEventListener("change", applyTheme);
applyTheme();
var subscribe2 = (listener) => {
  listeners2.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners2.delete(listener);
    window.removeEventListener("storage", listener);
  };
};
var useTheme = () => useSyncExternalStore2(subscribe2, getTheme);

// ../app/javascript/components/theme-toggle.jsx
import { jsx as jsx17, jsxs as jsxs10 } from "react/jsx-runtime";
var THEMES2 = { light: Sun, dark: Moon, system: Monitor };
function ThemeToggle() {
  const theme = useTheme();
  const Icon = THEMES2[theme];
  return /* @__PURE__ */ jsxs10(DropdownMenu, { children: [
    /* @__PURE__ */ jsx17(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx17(Button, { variant: "outline", size: "icon", "aria-label": "Theme", children: /* @__PURE__ */ jsx17(Icon, {}) }) }),
    /* @__PURE__ */ jsx17(DropdownMenuContent, { align: "end", children: /* @__PURE__ */ jsx17(DropdownMenuRadioGroup, { value: theme, onValueChange: setTheme, children: Object.entries(THEMES2).map(([value, ItemIcon]) => /* @__PURE__ */ jsxs10(DropdownMenuRadioItem, { value, className: "capitalize", children: [
      /* @__PURE__ */ jsx17(ItemIcon, { className: "size-4" }),
      value
    ] }, value)) }) })
  ] });
}

// ../app/javascript/layouts/admin-layout.jsx
import { jsx as jsx18, jsxs as jsxs11 } from "react/jsx-runtime";
function Layout({ children }) {
  const { admin, flash } = usePage().props;
  const path = usePage().url.split("?")[0];
  return /* @__PURE__ */ jsxs11(SidebarProvider, { children: [
    /* @__PURE__ */ jsx18(AdminSidebar, { admin, path }),
    /* @__PURE__ */ jsxs11(SidebarInset, { children: [
      /* @__PURE__ */ jsxs11("header", { className: "flex h-16 shrink-0 items-center justify-between gap-2 border-b", children: [
        /* @__PURE__ */ jsxs11("div", { className: "flex min-w-0 items-center gap-2 px-4", children: [
          /* @__PURE__ */ jsx18(SidebarTrigger, { className: "-ml-1" }),
          /* @__PURE__ */ jsx18(Separator, { orientation: "vertical", className: "mr-2 data-[orientation=vertical]:h-4" }),
          /* @__PURE__ */ jsx18(Breadcrumbs, { admin, path })
        ] }),
        /* @__PURE__ */ jsx18("div", { className: "px-4", children: /* @__PURE__ */ jsx18(ThemeToggle, {}) })
      ] }),
      /* @__PURE__ */ jsxs11("main", { className: "space-y-6 p-4 sm:p-6 lg:p-8", children: [
        Object.entries(flash || {}).map(([kind, message]) => /* @__PURE__ */ jsx18("p", { role: kind === "alert" ? "alert" : "status", className: "rounded-lg border p-3", children: message }, kind)),
        children
      ] })
    ] })
  ] });
}

// ../app/javascript/pages/settings/show.jsx
import React18 from "react";
import { Head as Head2 } from "@inertiajs/react";
import { Monitor as Monitor2, Moon as Moon2, Sun as Sun2 } from "lucide-react";
import { Fragment as Fragment5, jsx as jsx19, jsxs as jsxs12 } from "react/jsx-runtime";
var THEMES3 = { light: Sun2, dark: Moon2, system: Monitor2 };
function Settings2({ admin }) {
  const theme = useTheme();
  const variant = useSidebarVariant();
  return /* @__PURE__ */ jsxs12(Fragment5, { children: [
    /* @__PURE__ */ jsx19(Head2, { title: `Settings - ${admin.name} Admin` }),
    /* @__PURE__ */ jsx19("h1", { className: "text-2xl font-semibold tracking-tight", children: "Settings" }),
    /* @__PURE__ */ jsxs12("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx19("h2", { className: "text-lg font-medium", children: "Appearance" }),
      /* @__PURE__ */ jsx19("p", { className: "text-sm text-muted-foreground", children: "Saved in this browser." }),
      /* @__PURE__ */ jsx19("div", { role: "group", "aria-label": "Theme", className: "flex flex-wrap gap-2", children: Object.entries(THEMES3).map(([value, Icon]) => /* @__PURE__ */ jsxs12(Button, { type: "button", variant: theme === value ? "default" : "outline", "aria-pressed": theme === value, className: "capitalize", onClick: () => setTheme(value), children: [
        /* @__PURE__ */ jsx19(Icon, {}),
        value
      ] }, value)) })
    ] }),
    /* @__PURE__ */ jsxs12("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx19("h2", { className: "text-lg font-medium", children: "Sidebar" }),
      /* @__PURE__ */ jsx19("p", { className: "text-sm text-muted-foreground", children: "Inset floats the page as a rounded panel beside the sidebar. Saved in this browser." }),
      /* @__PURE__ */ jsx19("div", { role: "group", "aria-label": "Sidebar style", className: "flex flex-wrap gap-2", children: [["inset", "Inset"], ["sidebar", "Standard"]].map(([value, label]) => /* @__PURE__ */ jsx19(Button, { type: "button", variant: variant === value ? "default" : "outline", "aria-pressed": variant === value, onClick: () => setSidebarVariant(value), children: label }, value)) })
    ] }),
    admin.user && /* @__PURE__ */ jsxs12("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx19("h2", { className: "text-lg font-medium", children: "Account" }),
      /* @__PURE__ */ jsxs12("dl", { className: "grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1 text-sm", children: [
        /* @__PURE__ */ jsx19("dt", { className: "text-muted-foreground", children: "Name" }),
        /* @__PURE__ */ jsx19("dd", { children: admin.user.name }),
        /* @__PURE__ */ jsx19("dt", { className: "text-muted-foreground", children: "Email" }),
        /* @__PURE__ */ jsx19("dd", { children: admin.user.email })
      ] })
    ] })
  ] });
}

// ../app/javascript/components/resource-page.jsx
import React24 from "react";
import { Head as Head3, Link as Link7, router as router3 } from "@inertiajs/react";

// ../app/javascript/lib/registry.js
var registry = { layout: null, dashboard: null, views: {} };

// ../app/javascript/lib/ui.js
var buttonClass = "inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-neutral-700 dark:hover:bg-neutral-800";
var inputClass = "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

// ../app/javascript/pages/resource/form.jsx
import React20 from "react";
import { Link as Link5, useForm } from "@inertiajs/react";

// ../app/javascript/components/field.jsx
import React19, { useEffect as useEffect3, useRef, useState as useState5 } from "react";
import { Link as Link4 } from "@inertiajs/react";
import { Fragment as Fragment6, jsx as jsx20, jsxs as jsxs13 } from "react/jsx-runtime";
function Value({ value }) {
  if (value === null || value === void 0 || value === "") return /* @__PURE__ */ jsx20("span", { className: "text-neutral-500", children: "\u2014" });
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value.error) return /* @__PURE__ */ jsx20("span", { className: "text-red-600 dark:text-red-400", children: value.error });
  if (value.html !== void 0) return /* @__PURE__ */ jsx20("div", { className: "trix-content prose max-w-none dark:prose-invert", dangerouslySetInnerHTML: { __html: value.html } });
  if (value.links) return /* @__PURE__ */ jsxs13("div", { className: "space-y-1", children: [
    value.links.map((item, index) => /* @__PURE__ */ jsx20("div", { children: item.url ? item.external ? /* @__PURE__ */ jsx20("a", { href: item.url, className: "underline underline-offset-4", children: item.label }) : /* @__PURE__ */ jsx20(Link4, { href: item.url, className: "underline underline-offset-4", children: item.label }) : item.label }, `${item.url}-${index}`)),
    !value.links.length && /* @__PURE__ */ jsx20("span", { className: "text-neutral-500", children: "\u2014" }),
    /* @__PURE__ */ jsxs13("div", { className: "flex gap-3", children: [
      value.previous_url && /* @__PURE__ */ jsx20(Link4, { href: value.previous_url, preserveScroll: true, className: "underline", children: "Previous" }),
      value.next_url && /* @__PURE__ */ jsx20(Link4, { href: value.next_url, preserveScroll: true, className: "underline", children: "Next" })
    ] })
  ] });
  return typeof value === "object" ? /* @__PURE__ */ jsx20("pre", { className: "max-w-xl overflow-auto whitespace-pre-wrap break-words text-xs", children: JSON.stringify(value, null, 2) }) : String(value);
}
function Association({ field, value, onChange, id }) {
  const [options, setOptions] = useState5(field.options || []);
  const [query, setQuery] = useState5("");
  const [error, setError] = useState5("");
  const [loading, setLoading] = useState5(false);
  const pending = useRef(null);
  useEffect3(() => () => pending.current?.abort(), []);
  async function search() {
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    setLoading(true);
    setError("");
    try {
      const url = new URL(field.lookup, window.location.origin);
      url.searchParams.set("q", query);
      const response = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
      if (!response.ok) throw new Error("Could not load options.");
      const records = await response.json();
      setOptions((current) => [...new Map([...current, ...records.map((record) => ({ label: record.name, value: String(record.id) }))].map((option) => [option.value, option])).values()]);
    } catch (failure) {
      if (failure.name !== "AbortError") setError(failure.message);
    } finally {
      if (pending.current === controller) setLoading(false);
    }
  }
  const multiple = field.type === "has_many";
  return /* @__PURE__ */ jsxs13("div", { className: "space-y-2", children: [
    field.lookup && /* @__PURE__ */ jsxs13("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx20("input", { "aria-label": `Search ${field.label}`, type: "search", value: query, onChange: (event) => setQuery(event.target.value), className: inputClass }),
      /* @__PURE__ */ jsx20("button", { type: "button", onClick: search, disabled: loading, className: buttonClass, children: loading ? "Loading\u2026" : "Find" })
    ] }),
    error && /* @__PURE__ */ jsx20("p", { role: "alert", className: "text-red-600 dark:text-red-400", children: error }),
    /* @__PURE__ */ jsxs13("select", { id, multiple, required: field.required, value: value || (multiple ? [] : ""), onChange: (event) => onChange(multiple ? Array.from(event.target.selectedOptions, (option) => option.value) : event.target.value), className: inputClass, children: [
      !multiple && /* @__PURE__ */ jsx20("option", { value: "", children: "Select\u2026" }),
      options.map((option) => /* @__PURE__ */ jsx20("option", { value: option.value, children: option.label }, option.value))
    ] }),
    multiple && /* @__PURE__ */ jsx20("p", { className: "text-xs text-neutral-500", children: "Use Command or Control to select multiple records." })
  ] });
}
function RichText({ id, value, onChange, uploads }) {
  const editor = useRef(null);
  useEffect3(() => {
    const element = editor.current;
    const change = () => onChange(element.value);
    element.addEventListener("trix-change", change);
    return () => element.removeEventListener("trix-change", change);
  }, [onChange]);
  return /* @__PURE__ */ jsxs13(Fragment6, { children: [
    /* @__PURE__ */ jsx20("input", { id: `${id}-value`, type: "hidden", value: value || "" }),
    /* @__PURE__ */ jsx20("trix-editor", { ref: editor, id, input: `${id}-value`, "data-direct-upload-url": uploads.direct, "data-blob-url-template": uploads.blob, className: "trix-content min-h-40 dark:bg-neutral-900" })
  ] });
}
function Field({ field, value, onChange, uploads, error }) {
  const id = `field-${field.name}`;
  const props = { id, required: field.required, "aria-invalid": !!error, "aria-describedby": error ? `${id}-error` : void 0, className: inputClass };
  let input;
  if (field.readonly) input = /* @__PURE__ */ jsx20(Value, { value });
  else if (field.type === "boolean") input = /* @__PURE__ */ jsxs13("select", { ...props, value: value === null ? "" : String(value), onChange: (event) => onChange(event.target.value === "" ? null : event.target.value === "true"), children: [
    /* @__PURE__ */ jsx20("option", { value: "", children: "Not set" }),
    /* @__PURE__ */ jsx20("option", { value: "true", children: "Yes" }),
    /* @__PURE__ */ jsx20("option", { value: "false", children: "No" })
  ] });
  else if (["belongs_to", "has_many", "polymorphic", "enum", "select"].includes(field.type)) input = /* @__PURE__ */ jsx20(Association, { field, value, onChange, id });
  else if (field.type === "rich_text") input = /* @__PURE__ */ jsx20(RichText, { id, value, onChange, uploads });
  else if (["attachment", "attachments", "file"].includes(field.type)) input = /* @__PURE__ */ jsxs13(Fragment6, { children: [
    /* @__PURE__ */ jsx20("input", { ...props, required: field.required && !value?.links?.length, type: "file", multiple: field.type === "attachments", onChange: (event) => onChange(field.type === "attachments" ? Array.from(event.target.files) : event.target.files[0]) }),
    value?.links && /* @__PURE__ */ jsx20(Value, { value })
  ] });
  else if (["json", "text"].includes(field.type)) input = /* @__PURE__ */ jsx20("textarea", { ...props, rows: 6, value: value ?? "", onChange: (event) => onChange(event.target.value) });
  else {
    const type = { date_time: "datetime-local", datetime: "datetime-local", integer: "number", decimal: "number", float: "number", currency: "number", date: "date", time: "time", password: "password" }[field.type] || "text";
    input = /* @__PURE__ */ jsx20("input", { ...props, type, step: field.type === "integer" ? "1" : "any", value: value ?? "", autoComplete: type === "password" ? "new-password" : void 0, onChange: (event) => onChange(event.target.value) });
  }
  return /* @__PURE__ */ jsxs13("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs13("label", { htmlFor: id, className: "block text-sm font-medium", children: [
      field.label,
      field.required && " *",
      ["date_time", "datetime"].includes(field.type) && " (UTC)"
    ] }),
    input,
    field.description && /* @__PURE__ */ jsx20("p", { className: "text-sm text-neutral-500", children: field.description }),
    error && /* @__PURE__ */ jsx20("p", { id: `${id}-error`, role: "alert", className: "text-sm text-red-600 dark:text-red-400", children: [].concat(error).join(", ") })
  ] });
}

// ../app/javascript/pages/resource/form.jsx
import { jsx as jsx21, jsxs as jsxs14 } from "react/jsx-runtime";
function Form({ fields, record, resource, mode, urls, uploads, errors }) {
  const form = useForm(Object.fromEntries(fields.map((field) => [field.key, record.values[field.name]])));
  function submit(event) {
    event.preventDefault();
    form.transform((data) => {
      const values = {};
      for (const field of fields) {
        if (field.readonly) continue;
        let value = data[field.key];
        if (["attachment", "attachments", "file"].includes(field.type) && !(value instanceof File) && !Array.isArray(value)) continue;
        if (field.type === "polymorphic") value = { type: "polymorphic", value };
        if (field.type === "has_many" && value.length === 0) value = [""];
        if (["date_time", "datetime"].includes(field.type) && value) value += "Z";
        values[field.key] = value;
      }
      return { [resource.key]: values, ...mode === "edit" ? { _method: "patch" } : {} };
    });
    form.post(mode === "edit" ? record.url : urls.index, { preserveScroll: true, forceFormData: mode === "edit" });
  }
  return /* @__PURE__ */ jsxs14("form", { onSubmit: submit, className: "max-w-3xl space-y-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6", children: [
    Object.keys(errors).length > 0 && /* @__PURE__ */ jsxs14("div", { role: "alert", className: "rounded-lg border border-red-300 p-3 text-sm text-red-700 dark:border-red-800 dark:text-red-400", children: [
      /* @__PURE__ */ jsx21("p", { className: "font-semibold", children: "Please correct the following:" }),
      /* @__PURE__ */ jsx21("ul", { className: "list-inside list-disc", children: Object.entries(errors).map(([name, messages]) => /* @__PURE__ */ jsx21("li", { children: [].concat(messages).join(", ") }, name)) })
    ] }),
    fields.map((field) => /* @__PURE__ */ jsx21(Field, { field, value: form.data[field.key], onChange: (value) => form.setData(field.key, value), uploads, error: errors[field.name] || errors[field.key] }, field.name)),
    /* @__PURE__ */ jsxs14("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx21("button", { type: "submit", disabled: form.processing, className: buttonClass, children: form.processing ? "Saving\u2026" : "Save" }),
      /* @__PURE__ */ jsx21(Link5, { href: mode === "edit" ? record.url : urls.index, className: buttonClass, children: "Cancel" })
    ] })
  ] });
}

// ../app/javascript/pages/resource/index.jsx
import React22 from "react";
import { Link as Link6, router as router2 } from "@inertiajs/react";

// ../app/javascript/components/filters.jsx
import React21, { useState as useState6 } from "react";
import { router } from "@inertiajs/react";
import { jsx as jsx22, jsxs as jsxs15 } from "react/jsx-runtime";
var INPUT_TYPES = { number: "number", date: "date", datetime: "datetime-local" };
function indexUrl(base, params, filters) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => value && query.append(key, value));
  filters.forEach(({ column, operator, value }) => {
    query.append("filters[][column]", column);
    query.append("filters[][operator]", operator);
    query.append("filters[][value]", value || "");
  });
  const string = query.toString();
  return string ? `${base}?${string}` : base;
}
function Filters({ urls, params, columns, operators, active }) {
  const [open, setOpen] = useState6(false);
  const [rows, setRows] = useState6(active);
  if (!columns.length) return null;
  const columnFor = (name) => columns.find((column) => column.name === name) || columns[0];
  const blank = () => ({ column: columns[0].name, operator: operators[columns[0].type][0].value, value: "" });
  const update = (index, changes) => setRows(rows.map((row, i) => i === index ? { ...row, ...changes } : row));
  const apply = (next) => router.get(indexUrl(urls.index, { ...params, page: null }, next));
  const label = (filter) => {
    const column = columnFor(filter.column);
    const operator = operators[column.type].find((item) => item.value === filter.operator);
    return `${column.label} ${operator?.label.toLowerCase()}${operator?.valueless ? "" : ` "${filter.value}"`}`;
  };
  const remove = (index) => apply(active.filter((_, i) => i !== index));
  return /* @__PURE__ */ jsxs15("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs15("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxs15("button", { type: "button", className: buttonClass, "aria-expanded": open, onClick: () => {
        setRows(active.length ? active : [blank()]);
        setOpen(!open);
      }, children: [
        "Filters",
        active.length > 0 && /* @__PURE__ */ jsx22("span", { className: "ml-2 rounded-full bg-neutral-900 px-2 text-xs text-white dark:bg-neutral-100 dark:text-neutral-900", children: active.length })
      ] }),
      active.map((filter, index) => /* @__PURE__ */ jsxs15("span", { className: "inline-flex items-center gap-1 rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium dark:border-neutral-700", children: [
        label(filter),
        /* @__PURE__ */ jsx22("button", { type: "button", "aria-label": `Remove filter ${label(filter)}`, className: "text-neutral-500 hover:text-current", onClick: () => remove(index), children: "\xD7" })
      ] }, index)),
      active.length > 0 && /* @__PURE__ */ jsx22("button", { type: "button", className: "text-xs underline", onClick: () => apply([]), children: "Clear all" })
    ] }),
    open && /* @__PURE__ */ jsxs15(
      "form",
      {
        onSubmit: (event) => {
          event.preventDefault();
          setOpen(false);
          apply(rows);
        },
        className: "absolute left-0 z-20 mt-2 w-[min(42rem,calc(100vw-2rem))] space-y-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-900",
        children: [
          /* @__PURE__ */ jsx22("p", { className: "text-sm font-semibold", children: "Show records where" }),
          rows.map((row, index) => {
            const column = columnFor(row.column);
            const operator = operators[column.type].find((item) => item.value === row.operator);
            return /* @__PURE__ */ jsxs15("div", { className: "grid grid-cols-[1fr_1fr] gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]", children: [
              /* @__PURE__ */ jsx22("select", { "aria-label": "Column", className: inputClass, value: row.column, onChange: (event) => {
                const next = columnFor(event.target.value);
                update(index, { column: next.name, operator: operators[next.type][0].value, value: "" });
              }, children: columns.map((item) => /* @__PURE__ */ jsx22("option", { value: item.name, children: item.label }, item.name)) }),
              /* @__PURE__ */ jsx22("select", { "aria-label": "Operator", className: inputClass, value: row.operator, onChange: (event) => update(index, { operator: event.target.value }), children: operators[column.type].map((item) => /* @__PURE__ */ jsx22("option", { value: item.value, children: item.label }, item.value)) }),
              operator?.valueless ? /* @__PURE__ */ jsx22("span", { className: "hidden sm:block" }) : /* @__PURE__ */ jsx22("input", { "aria-label": "Value", className: inputClass, type: INPUT_TYPES[column.type] || "text", step: column.type === "number" ? "any" : void 0, value: row.value, onChange: (event) => update(index, { value: event.target.value }), autoFocus: index === rows.length - 1 }),
              /* @__PURE__ */ jsx22("button", { type: "button", "aria-label": "Remove row", className: "px-2 text-neutral-500 hover:text-current", onClick: () => setRows(rows.filter((_, i) => i !== index)), children: "\xD7" })
            ] }, index);
          }),
          /* @__PURE__ */ jsxs15("div", { className: "flex justify-between gap-2", children: [
            /* @__PURE__ */ jsx22("button", { type: "button", className: buttonClass, onClick: () => setRows([...rows, blank()]), children: "Add filter" }),
            /* @__PURE__ */ jsx22("button", { type: "submit", className: "inline-flex items-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900", children: "Apply" })
          ] })
        ]
      }
    )
  ] });
}

// ../app/javascript/pages/resource/index.jsx
import { Fragment as Fragment7, jsx as jsx23, jsxs as jsxs16 } from "react/jsx-runtime";
function Index({ resource, fields, records, urls, filters, scopes, pagination, filter_columns, filter_operators, active_filters }) {
  function search(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    router2.get(indexUrl(urls.index, { ...filters, q: data.get("q"), scope: data.get("scope"), page: null }, active_filters));
  }
  return /* @__PURE__ */ jsxs16(Fragment7, { children: [
    /* @__PURE__ */ jsxs16("form", { onSubmit: search, className: "flex flex-col gap-2 sm:flex-row sm:items-end", children: [
      /* @__PURE__ */ jsxs16("label", { className: "block sm:w-80", children: [
        /* @__PURE__ */ jsxs16("span", { className: "mb-1 block text-sm font-medium", children: [
          "Search ",
          resource.label
        ] }),
        /* @__PURE__ */ jsx23("input", { name: "q", type: "search", defaultValue: filters.q, className: inputClass }, filters.q)
      ] }),
      /* @__PURE__ */ jsxs16("label", { children: [
        /* @__PURE__ */ jsx23("span", { className: "mb-1 block text-sm font-medium", children: "Scope" }),
        /* @__PURE__ */ jsx23("select", { name: "scope", defaultValue: filters.scope, className: inputClass, children: scopes.map((scope) => /* @__PURE__ */ jsx23("option", { value: scope.value, children: scope.label }, scope.value)) }, filters.scope)
      ] }),
      /* @__PURE__ */ jsx23("button", { type: "submit", className: buttonClass, children: "Search" }),
      filters.q && /* @__PURE__ */ jsx23(Link6, { href: urls.index, className: buttonClass, children: "Clear" })
    ] }),
    /* @__PURE__ */ jsx23(Filters, { urls, params: filters, columns: filter_columns, operators: filter_operators, active: active_filters }),
    /* @__PURE__ */ jsx23("div", { className: "overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900", children: /* @__PURE__ */ jsxs16("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx23("caption", { className: "sr-only", children: resource.label }),
      /* @__PURE__ */ jsx23("thead", { className: "border-b border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950", children: /* @__PURE__ */ jsx23("tr", { children: fields.map((field) => /* @__PURE__ */ jsx23("th", { scope: "col", className: "whitespace-nowrap px-4 py-3 text-left", "aria-sort": filters.sort === field.name ? filters.direction === "asc" ? "ascending" : "descending" : "none", children: field.sortable ? /* @__PURE__ */ jsxs16(Link6, { href: indexUrl(urls.index, { ...filters, sort: field.name, direction: filters.sort === field.name && filters.direction === "asc" ? "desc" : "asc" }, active_filters), children: [
        field.label,
        filters.sort === field.name ? filters.direction === "asc" ? " \u2191" : " \u2193" : ""
      ] }) : field.label }, field.name)) }) }),
      /* @__PURE__ */ jsxs16("tbody", { className: "divide-y divide-neutral-200 dark:divide-neutral-800", children: [
        records.map((item) => /* @__PURE__ */ jsx23("tr", { children: fields.map((field, index) => /* @__PURE__ */ jsx23("td", { className: "min-w-32 px-4 py-4", children: index === 0 && (item.values[field.name] === null || typeof item.values[field.name] !== "object") ? /* @__PURE__ */ jsx23(Link6, { href: item.url, className: "font-medium underline underline-offset-4", children: /* @__PURE__ */ jsx23(Value, { value: item.values[field.name] }) }) : /* @__PURE__ */ jsx23(Value, { value: item.values[field.name] }) }, field.name)) }, item.id)),
        !records.length && /* @__PURE__ */ jsx23("tr", { children: /* @__PURE__ */ jsx23("td", { colSpan: fields.length, className: "p-10 text-center text-neutral-500", children: "No records found." }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs16("nav", { "aria-label": "Pagination", className: "flex flex-wrap items-center justify-between gap-3 text-sm", children: [
      /* @__PURE__ */ jsxs16("p", { children: [
        pagination.count,
        " records \xB7 Page ",
        pagination.page,
        " of ",
        pagination.pages
      ] }),
      /* @__PURE__ */ jsxs16("div", { className: "flex gap-2", children: [
        pagination.previous && /* @__PURE__ */ jsx23(Link6, { href: indexUrl(urls.index, { ...filters, page: pagination.previous }, active_filters), className: buttonClass, children: "Previous" }),
        pagination.next && /* @__PURE__ */ jsx23(Link6, { href: indexUrl(urls.index, { ...filters, page: pagination.next }, active_filters), className: buttonClass, children: "Next" })
      ] })
    ] })
  ] });
}

// ../app/javascript/pages/resource/show.jsx
import React23 from "react";
import { jsx as jsx24, jsxs as jsxs17 } from "react/jsx-runtime";
function Show({ fields, record }) {
  return /* @__PURE__ */ jsx24("dl", { className: "divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900", children: fields.map((field) => /* @__PURE__ */ jsxs17("div", { className: "grid gap-2 p-4 md:grid-cols-[14rem_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsx24("dt", { className: "text-sm font-medium", children: field.label }),
    /* @__PURE__ */ jsx24("dd", { className: "min-w-0 break-words text-sm", children: /* @__PURE__ */ jsx24(Value, { value: record.values[field.name] }) })
  ] }, field.name)) });
}

// ../app/javascript/components/resource-page.jsx
import { Fragment as Fragment8, jsx as jsx25, jsxs as jsxs18 } from "react/jsx-runtime";
var defaults = { index: Index, show: Show, form: Form };
function Resource(props) {
  const { mode, resource, record, urls, admin } = props;
  const name = ["new", "edit"].includes(mode) ? "form" : mode;
  const View = registry.views[`${resource.key}/${name}`] || registry.views[name] || defaults[name];
  const title = mode === "index" ? resource.label : mode === "new" ? `New ${resource.name}` : mode === "edit" ? `Edit ${record.label}` : record.label;
  return /* @__PURE__ */ jsxs18(Fragment8, { children: [
    /* @__PURE__ */ jsx25(Head3, { title: `${title} - ${admin.name} Admin` }),
    /* @__PURE__ */ jsxs18("header", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs18("div", { children: [
        mode !== "index" && /* @__PURE__ */ jsxs18(Link7, { href: urls.index, className: "mb-2 block text-sm underline", children: [
          "\u2190 ",
          resource.label
        ] }),
        /* @__PURE__ */ jsx25("h1", { className: "text-2xl font-semibold tracking-tight", children: title })
      ] }),
      /* @__PURE__ */ jsxs18("div", { className: "flex flex-wrap gap-2", children: [
        mode === "index" && /* @__PURE__ */ jsxs18(Link7, { href: urls.new, className: buttonClass, children: [
          "New ",
          resource.name
        ] }),
        mode === "show" && /* @__PURE__ */ jsxs18(Fragment8, { children: [
          /* @__PURE__ */ jsx25(Link7, { href: record.edit_url, className: buttonClass, children: "Edit" }),
          /* @__PURE__ */ jsx25("button", { type: "button", className: buttonClass, onClick: () => {
            if (window.confirm(`Delete ${record.label}? This cannot be undone.`)) router3.delete(record.url);
          }, children: "Delete" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx25(View, { ...props }, mode === "index" ? void 0 : `${resource.key}-${record.id}-${mode}`)
  ] });
}

// ../index.jsx
import { jsx as jsx26 } from "react/jsx-runtime";
function start({ layout, dashboard, views = {} } = {}) {
  Object.assign(registry, { layout, dashboard, views });
  const Layout2 = layout || Layout;
  const pages = { "Madmin/Resource": Resource, "Madmin/Dashboard": dashboard || Dashboard, "Madmin/Settings": Settings2 };
  createInertiaApp({
    resolve: (name) => {
      const page = pages[name];
      if (!page) throw new Error(`Unknown admin page: ${name}`);
      page.layout = (children) => /* @__PURE__ */ jsx26(Layout2, { children });
      return page;
    },
    setup({ el, App, props }) {
      createRoot(el).render(/* @__PURE__ */ jsx26(App, { ...props }));
    }
  });
}
export {
  AdminSidebar,
  Breadcrumbs,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  Field,
  Filters,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  ThemeToggle,
  Value,
  buttonClass,
  indexUrl,
  inputClass,
  start,
  useSidebar
};
