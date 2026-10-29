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

`madmin_inertia:install` creates a six-line `app/javascript/madmin.jsx`, installs `@inertiajs/react`, `react`, `react-dom`, links the gem's `madmin-inertia` JS package (it detects pnpm, yarn, bun or npm), and adds the Tailwind `@source` lines. The layout, dashboard and resource views stay in the gem until you eject them.

## Customizing views

Like Madmin's `rails g madmin:views`, copy a gem component into your app only when you need to change it. The generators register it in `app/javascript/madmin.jsx` for you:

```sh
rails g madmin_inertia:views                 # layout, dashboard, index, show, form
rails g madmin_inertia:views:layout          # app/javascript/madmin/layout.jsx
rails g madmin_inertia:views:dashboard       # app/javascript/madmin/dashboard.jsx
rails g madmin_inertia:views:index           # app/javascript/madmin/views/index.jsx (all resources)
rails g madmin_inertia:views:index Post      # app/javascript/madmin/views/post/index.jsx (only Post)
rails g madmin_inertia:views:show Post
rails g madmin_inertia:views:form Post       # new and edit
```

A model-specific view wins over a generic one, which wins over the gem's. Rebuild with `pnpm build` after ejecting.

## Host contract

- Optionally define a private `admin_user_props` in `Madmin::ApplicationController` returning `{user: {name:, email:}, logout: path}` to show the signed-in user in the default layout.
- Define your own `Madmin::DashboardController#show` to replace the gem's dashboard (the gem only supplies one when the app has none).
- Apps that run their own `createInertiaApp` can use `pages({...})` from `madmin-inertia` instead of `start()`; `Field`, `Value`, `Filters`, `indexUrl`, `buttonClass` and `inputClass` are exported for ejected components.
- Override `layouts/madmin/inertia` if your asset names differ (default loads `application` CSS and the `madmin` JS bundle).

## Without Inertia

Leave the gem out of the Gemfile; Madmin renders its own ERB pages.
