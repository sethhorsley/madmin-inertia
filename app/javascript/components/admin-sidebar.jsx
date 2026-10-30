import React, { useState } from "react"
import { Link } from "@inertiajs/react"
import { ChevronRight, ChevronsUpDown, Folder, LayoutDashboard, LogOut, Settings, ShieldCheck, User } from "lucide-react"
import { isActive } from "../lib/navigation"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail, useSidebar,
} from "./ui/sidebar"

// "Account / Notifier / Alerts" => group "Account", sublink "Notifier - Alerts"; labels without " / " stay flat.
function namespaced(children) {
  const entries = []
  const parents = {}
  for (const child of children) {
    const [parent, ...rest] = child.label.split(" / ")
    if (!rest.length) { entries.push(child); continue }
    if (!parents[parent]) { parents[parent] = { label: parent, children: [] }; entries.push(parents[parent]) }
    parents[parent].children.push({ ...child, label: rest.join(" - ") })
  }
  return entries
}

// Links inside the admin navigate with Inertia; anything else is a plain anchor.
function NavLink({ admin, item, children, ...props }) {
  return item.url?.startsWith(admin.dashboard)
    ? <Link href={item.url} {...props}>{children}</Link>
    : <a href={item.url || "#"} {...props}>{children}</a>
}

function Leaf({ admin, item, active }) {
  return <SidebarMenuSubItem>
    <SidebarMenuSubButton asChild isActive={active}><NavLink admin={admin} item={item}><span>{item.label}</span></NavLink></SidebarMenuSubButton>
  </SidebarMenuSubItem>
}

function Namespace({ admin, entry, active, forceOpen }) {
  return <Collapsible defaultOpen={entry.children.some(active)} open={forceOpen || undefined} asChild className="group/namespace">
    <SidebarMenuSubItem>
      <CollapsibleTrigger asChild>
        <SidebarMenuSubButton className="w-full cursor-pointer">
          <span>{entry.label}</span>
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/namespace:rotate-90" />
        </SidebarMenuSubButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>{entry.children.map((child) => <Leaf key={child.url} admin={admin} item={child} active={active(child)} />)}</SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuSubItem>
  </Collapsible>
}

// A collapsible section; opens itself when it holds the current page, and expands the sidebar if it was an icon rail.
function Section({ admin, item, active, forceOpen }) {
  const { open, setOpen } = useSidebar()
  const [expanded, setExpanded] = useState(item.children.some(active))
  return <Collapsible asChild open={expanded || forceOpen} onOpenChange={(value) => { if (!open) setOpen(true); setExpanded(value) }} className="group/collapsible">
    <SidebarMenuItem>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton tooltip={item.label}>
          <Folder />
          <span>{item.label}</span>
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {namespaced(item.children).map((entry) => entry.children
            ? <Namespace key={entry.label} admin={admin} entry={entry} active={active} forceOpen={forceOpen} />
            : <Leaf key={entry.url} admin={admin} item={entry} active={active(entry)} />)}
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
}

// Profile menu in the footer. Signed out (no `admin.user`) it is just "Profile"; Settings is always there.
// Sign out is a real DELETE form post, so it works with Devise-style routes.
function NavUser({ admin }) {
  const { isMobile } = useSidebar()
  const { user, logout } = admin
  const token = document.querySelector('meta[name="csrf-token"]')?.content
  const name = user?.name || "Profile"
  return <SidebarMenu><SidebarMenuItem>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <Avatar className="h-8 w-8 rounded-lg"><AvatarFallback className="rounded-lg">{user ? name.slice(0, 2).toUpperCase() : <User className="size-4" />}</AvatarFallback></Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight"><span className="truncate font-medium">{name}</span>{user?.email && <span className="truncate text-xs">{user.email}</span>}</div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
        {user && <><DropdownMenuLabel className="font-normal"><div className="grid text-sm leading-tight"><span className="truncate font-medium">{user.name}</span><span className="truncate text-xs text-muted-foreground">{user.email}</span></div></DropdownMenuLabel><DropdownMenuSeparator /></>}
        <DropdownMenuItem asChild><Link href={admin.settings}><Settings />Settings</Link></DropdownMenuItem>
        {user && logout && <>
          <DropdownMenuSeparator />
          <form method="post" action={logout}>
            <input type="hidden" name="_method" value="delete" />
            <input type="hidden" name="authenticity_token" value={token} />
            <DropdownMenuItem asChild><button type="submit" className="w-full cursor-pointer"><LogOut />Log out</button></DropdownMenuItem>
          </form>
        </>}
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem></SidebarMenu>
}

export default function AdminSidebar({ admin, path }) {
  const [search, setSearch] = useState("")
  const active = (item) => isActive(item, path, admin.dashboard)
  const matches = (item) => item.label.toLowerCase().includes(search.toLowerCase())
  const navigation = admin.navigation.filter((item) => matches(item) || item.children.some(matches))

  return <Sidebar variant="inset" collapsible="icon">
    <SidebarHeader>
      <SidebarMenu><SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href={admin.dashboard}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><ShieldCheck className="size-4" /></div>
            <div className="grid flex-1 text-left text-sm leading-tight"><span className="truncate font-medium">{admin.name}</span><span className="truncate text-xs">Admin</span></div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem></SidebarMenu>
      <Input type="search" aria-label="Find a resource" placeholder="Find a resource…" value={search} onChange={(event) => setSearch(event.target.value)} className="group-data-[collapsible=icon]:hidden" />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem><SidebarMenuButton asChild tooltip="Dashboard" isActive={path === admin.dashboard}><Link href={admin.dashboard}><LayoutDashboard /><span>Dashboard</span></Link></SidebarMenuButton></SidebarMenuItem>
          {navigation.map((item) => item.url
            ? <SidebarMenuItem key={item.label}><SidebarMenuButton asChild tooltip={item.label} isActive={active(item)}><NavLink admin={admin} item={item}><Folder /><span>{item.label}</span></NavLink></SidebarMenuButton></SidebarMenuItem>
            : <Section key={item.label} admin={admin} item={{ ...item, children: item.children.filter((child) => matches(item) || matches(child)) }} active={active} forceOpen={search !== ""} />)}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter><NavUser admin={admin} /></SidebarFooter>
    <SidebarRail />
  </Sidebar>
}
