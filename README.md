# madmin_inertia

Renders [Madmin](https://github.com/excid3/madmin) resources (index, show, new, edit, filters, search, pagination) as Inertia + React pages.

## Requirements

- Rails 7.2+ with Active Storage and Active Job loaded (Madmin needs them)
- An esbuild setup that emits ES modules (the default `layouts/madmin/inertia` loads `madmin.js` with `type="module"`)
- Tailwind CSS

## Install

Add the gem next to Madmin, from RubyGems:

```ruby
# Gemfile
gem "madmin"
gem "madmin_inertia"
```

or straight from GitHub:

```ruby
gem "madmin"
gem "madmin_inertia", github: "sethhorsley/madmin-inertia"
```

Then:

```sh
bundle install
rails g madmin:install
rails g madmin_inertia:install
pnpm build && pnpm build:css
```

`madmin_inertia:install` creates the JS entry, layout and dashboard, adds `admin_user_props` to `Madmin::ApplicationController`, installs `@inertiajs/react`, `react`, `react-dom` and links the gem's `madmin-inertia` JS package (it detects pnpm, yarn, bun or npm), and adds the Tailwind `@source` lines.

## Host contract

- Define a private `admin_user_props` in `Madmin::ApplicationController` returning `{user: {name:, email:}, logout: path}` (the generator adds a placeholder).
- Provide your own layout component (sidebar, flash) wrapping the pages; `buttonClass` / `inputClass` are exported from `madmin-inertia` for reuse.
- Override `layouts/madmin/inertia` if your asset names differ (default loads `application` CSS and the `madmin` JS bundle).

## Without Inertia

Leave the gem out of the Gemfile; Madmin renders its own ERB pages.
