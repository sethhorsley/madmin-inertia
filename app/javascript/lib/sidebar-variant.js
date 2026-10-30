import { useSyncExternalStore } from "react"

const KEY = "madmin-sidebar-variant"
const listeners = new Set()

// @return ["inset", "sidebar"] the saved layout, "inset" by default
export const getSidebarVariant = () => {
  try { return localStorage.getItem(KEY) === "sidebar" ? "sidebar" : "inset" } catch { return "inset" }
}

export function setSidebarVariant(variant) {
  try { localStorage.setItem(KEY, variant) } catch { /* private mode: applies for this page only */ }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener) => {
  listeners.add(listener)
  window.addEventListener("storage", listener)
  return () => { listeners.delete(listener); window.removeEventListener("storage", listener) }
}

// Re-renders the sidebar when the Settings page (or another tab) changes the choice.
export const useSidebarVariant = () => useSyncExternalStore(subscribe, getSidebarVariant)
