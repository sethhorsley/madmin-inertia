require "rails/generators"
require "madmin_inertia/package_manager"

module MadminInertia
  module Generators
    # rails g madmin_inertia:bundle
    #
    # Switches the app from the gem's prebuilt bundle to its own esbuild bundle: the JS entry,
    # the linked npm package and the Tailwind source path. Run automatically the first time
    # you eject a view with `rails g madmin_inertia:views`.
    class BundleGenerator < Rails::Generators::Base
      TAILWIND_CSS = "app/assets/stylesheets/application.tailwind.css"

      source_root File.expand_path("templates", __dir__)

      # Stops early when the app has no JS bundler; warns about what will break later.
      # @return [void]
      def check_prerequisites
        raise Thor::Error, "Customizing views needs a package.json (esbuild). Add jsbundling-rails with esbuild and run this again." unless package_scripts

        say("No esbuild \"build\" script in package.json; bundle app/javascript/madmin.jsx into app/assets/builds/madmin.js yourself.", :yellow) unless package_scripts["build"].to_s.include?("esbuild")
        say("No app/assets/stylesheets/application.tailwind.css; the pages use Tailwind classes, so add Tailwind and scan #{gem_root}/app/javascript.", :yellow) unless File.exist?(File.join(destination_root, TAILWIND_CSS))
      end

      # The gem ships the layout, dashboard and views; only this entry lives in the app.
      # @return [void]
      def add_entry
        copy_file "madmin.jsx", "app/javascript/madmin.jsx"
      end

      # @return [void]
      def link_npm_package
        relative = Pathname.new(gem_root).relative_path_from(Pathname.new(destination_root))
        run package_manager.add_command("@inertiajs/react react react-dom madmin-inertia@#{package_manager.link_spec(relative)}")
      end

      # esbuild must resolve react from the app when bundling the linked package.
      # @return [void]
      def patch_build_script
        gsub_file "package.json", /"build": "esbuild /, '"build": "NODE_PATH=$PWD/node_modules esbuild '
      end

      # @return [void]
      def add_tailwind_source
        css = TAILWIND_CSS
        return unless File.exist?(File.join(destination_root, css))

        return if File.read(File.join(destination_root, css)).include?("madmin-inertia")

        relative = Pathname.new(gem_root).relative_path_from(Pathname.new(File.join(destination_root, File.dirname(css))))
        append_to_file css, %(\n@source "#{relative}/app/javascript";\n@source "../../javascript";\n)
      end

      # @return [void]
      def show_next_steps
        builds = [package_manager.build_command]
        builds << package_manager.script_command("build:css") if File.exist?(File.join(destination_root, TAILWIND_CSS))
        say "\nThe app now builds its own admin bundle. Build it and reload /madmin:", :green
        say "  #{builds.join(" && ")}   (or run bin/dev, which watches both)"
      end

      private

      # @return [Hash, nil] the package.json scripts, nil when there is no package.json
      def package_scripts
        path = File.join(destination_root, "package.json")
        JSON.parse(File.read(path)).fetch("scripts", {}) if File.exist?(path)
      end

      # @return [String]
      def gem_root
        Gem.loaded_specs.fetch("madmin_inertia").full_gem_path
      end

      # @return [MadminInertia::PackageManager]
      def package_manager
        @package_manager ||= MadminInertia::PackageManager.new(destination_root)
      end
    end
  end
end
