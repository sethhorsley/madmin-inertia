# madmin_inertia

Renders [Madmin](https://github.com/excid3/madmin) resources (index, show, new, edit, filters, search, pagination) as Inertia + React pages.

## Install

```ruby
# Gemfile
gem "madmin_inertia", path: "../madmin-inertia"
```

```json
// package.json
"madmin-inertia": "link:../madmin-inertia"
```

```jsx
// app/javascript/madmin.jsx
import { pages } from "madmin-inertia"

createInertiaApp({
  resolve: (name) => { /* ... */ pages({ "Madmin/Dashboard": Dashboard })[name] },
})
```

## Host contract

- Define a private `admin_user_props` in `Madmin::ApplicationController` returning `{user: {name:, email:}, logout: path}`.
- Provide your own layout component (sidebar, flash) wrapping the pages; `buttonClass` / `inputClass` are exported for reuse.
- Override `layouts/madmin/inertia` if your asset names differ (default loads `application` CSS and `madmin` JS).
