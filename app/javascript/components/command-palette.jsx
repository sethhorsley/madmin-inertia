import React, { useEffect, useState } from "react"
import { router } from "@inertiajs/react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const MIN_LENGTH = 2

// shadcn's CommandDialog sizing, which its CommandDialog applies but this hand-built dialog would otherwise miss.
const SIZING = "**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
// Undo @tailwindcss/forms' border, padding and focus ring on text inputs in apps that load it.
const RESET = "border-0 px-0 shadow-none ring-0 focus:border-0 focus:ring-0"

// Admin pages the palette can jump to without a request.
const pages = (admin) => {
  const all = [{ label: "Dashboard", url: admin.dashboard }, ...admin.navigation.flatMap((item) => item.url ? [item] : item.children), { label: "Settings", url: admin.settings }]
  return all.filter((page, index) => all.findIndex((other) => other.url === page.url) === index)
}

// Cmd/Ctrl+K opens it. With nothing typed it lists every page (the tables); typing filters pages in the browser; records come from the server (admin.search), which applies each
// resource's own Madmin rules: `menu false`, `searchable:` on attributes and `display_name(record)`.
export default function CommandPalette({ admin }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [records, setRecords] = useState([])
  const [searching, setSearching] = useState(false)
  const term = query.trim()
  const ready = term.length >= MIN_LENGTH

  useEffect(() => {
    const toggle = (event) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) { event.preventDefault(); setOpen((value) => !value) }
    }
    document.addEventListener("keydown", toggle)
    return () => document.removeEventListener("keydown", toggle)
  }, [])

  useEffect(() => {
    if (!ready) { setRecords([]); setSearching(false); return }
    setSearching(true)
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetch(`${admin.search}?q=${encodeURIComponent(term)}`, { headers: { Accept: "application/json" }, signal: controller.signal })
        .then((response) => response.ok ? response.json() : { results: [] })
        .then((data) => { setRecords(data.results); setSearching(false) })
        .catch((error) => { if (error.name !== "AbortError") setSearching(false) })
    }, 300)
    return () => { clearTimeout(timer); controller.abort() }
  }, [term, ready, admin.search])

  const close = (nextOpen) => { setOpen(nextOpen); if (!nextOpen) { setQuery(""); setRecords([]) } }
  const go = (url) => { close(false); router.visit(url) }
  const matchingPages = pages(admin).filter((page) => page.label.toLowerCase().includes(term.toLowerCase()))
  const groups = records.reduce((all, record) => ({ ...all, [record.group]: [...(all[record.group] || []), record] }), {})

  return <>
    <Button type="button" variant="outline" className="text-muted-foreground" onClick={() => setOpen(true)} aria-label="Search">
      <Search /><span className="hidden sm:inline">Search…</span>
      <kbd className="hidden rounded border px-1.5 text-xs sm:inline">⌘K</kbd>
    </Button>
    <Dialog open={open} onOpenChange={close}>
      <DialogHeader className="sr-only"><DialogTitle>Search</DialogTitle><DialogDescription>Search records and pages</DialogDescription></DialogHeader>
      <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
        <Command shouldFilter={false} className={SIZING}>
          <CommandInput className={RESET} placeholder="Search records and pages…" value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>{searching ? "Searching…" : ready ? "No results." : `No matching pages. Type ${MIN_LENGTH}+ characters to search records.`}</CommandEmpty>
            {matchingPages.length > 0 && <CommandGroup heading="Pages">
              {matchingPages.map((page) => <CommandItem key={page.url} value={`page ${page.url}`} onSelect={() => go(page.url)}>{page.label}</CommandItem>)}
            </CommandGroup>}
            {Object.entries(groups).map(([group, items]) => <CommandGroup key={group} heading={group}>
              {items.map((item) => <CommandItem key={item.url} value={`${group} ${item.url}`} onSelect={() => go(item.url)}>{item.label}</CommandItem>)}
            </CommandGroup>)}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  </>
}
