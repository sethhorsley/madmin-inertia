// @return [Boolean] whether the nav item is the current page (or an ancestor of it, e.g. a record under its index)
export const isActive = (item, path, dashboard) =>
  Boolean(item.url) && item.url !== dashboard && (path === item.url || path.startsWith(`${item.url}/`))

// @return [Array] the trail for the breadcrumb, e.g. [section, page]; empty on the dashboard
export function trail(navigation, path, dashboard) {
  const active = (item) => isActive(item, path, dashboard)
  for (const item of navigation) {
    const child = item.children.find(active)
    if (child) return [item, child]
    if (active(item)) return [item]
  }
  return []
}
