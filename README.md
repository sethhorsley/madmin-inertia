# madmin_inertia

Renders [Madmin](https://github.com/excid3/madmin) resources (index, show, new, edit, filters, search, pagination) as Inertia + React pages.

## Requirements

- Rails 7.2+ with Active Storage and Active Job loaded (Madmin needs them)
- Nothing else to run the admin: it ships a prebuilt JS and CSS bundle, so it works in importmap apps with no Node, esbuild or Tailwind.
- To customize views: jsbundling-rails with esbuild. Importmap apps can run the admin but not customize its views.

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
rails g madmin_inertia:install   # checks the app; there is no JS setup
```

Visit `/madmin`.

## Customizing views

Like Madmin's `rails g madmin:views`, copy a gem component into your app only when you need to change it:

```sh
rails g madmin_inertia:views                 # layout, dashboard, index, show, form
rails g madmin_inertia:views:layout          # app/javascript/madmin/layout.jsx
rails g madmin_inertia:views:dashboard       # app/javascript/madmin/dashboard.jsx
rails g madmin_inertia:views:index           # app/javascript/madmin/views/index.jsx (all resources)
rails g madmin_inertia:views:index Post      # app/javascript/madmin/views/post/index.jsx (only Post)
rails g madmin_inertia:views:show Post
rails g madmin_inertia:views:form Post       # new and edit
```

Each generator registers the copied component for you. A model-specific view wins over a generic one, which wins over the gem's.

The first eject runs `rails g madmin_inertia:bundle`. It creates a six-line `app/javascript/madmin.jsx`, installs `@inertiajs/react`, `react`, `react-dom`, links the gem's `madmin-inertia` JS package (pnpm, yarn, bun or npm), patches the esbuild `build` script, and adds Tailwind `@source` lines when Tailwind is present. Components are copied as JSX under `app/javascript/madmin/`. Run `yarn build` (or `pnpm build`, `npm run build`) afterwards; once the app produces `madmin.js`, the layout loads it instead of the gem's prebuilt bundle (the gem's CSS still loads, so no Tailwind is required).

Ejecting needs a `package.json` (jsbundling-rails with esbuild). Importmap apps run the admin from the prebuilt bundle but can't customize its views, because there is no compiler for JSX; the generators stop with an error telling you to add jsbundling-rails.

## Host contract

- Optionally define a private `admin_user_props` in `Madmin::ApplicationController` returning `{user: {name:, email:}, logout: path}` to show the signed-in user in the default layout.
- Define your own `Madmin::DashboardController#show` to replace the gem's dashboard (the gem only supplies one when the app has none).
- Apps that run their own `createInertiaApp` can use `pages({...})` from `madmin-inertia` instead of `start()`; `Field`, `Value`, `Filters`, `indexUrl`, `buttonClass` and `inputClass` are exported for ejected components.
- Override `layouts/madmin/inertia` if your asset names differ (default loads `application` CSS and the `madmin` JS bundle).

## Without Inertia

Leave the gem out of the Gemfile; Madmin renders its own ERB pages.

## Development

The prebuilt bundle in `app/assets/builds` comes from `build/`. After changing anything under `app/javascript` or `index.jsx`:

```sh
cd build && pnpm install && pnpm build
```

Commit the rebuilt `madmin_inertia.js` and `madmin_inertia.css`. `build/` has its own `node_modules` on purpose: apps link the gem root, and a second copy of React there would break hooks.
