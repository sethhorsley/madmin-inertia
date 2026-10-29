require "rails/generators"

module MadminInertia
  module Generators
    # rails g madmin_inertia:install
    #
    # Sets up the host app for Inertia-rendered Madmin: JS entry, layout, dashboard,
    # the `admin_user_props` hook, the linked npm package and the Tailwind source path.
    # Run `rails g madmin:install` first.
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path("templates", __dir__)

      # @return [void]
      def add_javascript
        copy_file "madmin.jsx", "app/javascript/madmin.jsx"
        copy_file "layout.jsx", "app/javascript/pages/madmin/layout.jsx"
        copy_file "dashboard.jsx", "app/javascript/pages/madmin/dashboard.jsx"
      end

      # @return [void]
      def add_dashboard
        copy_file "dashboard_controller.rb", "app/controllers/madmin/dashboard_controller.rb"
      end

      # Required by the engine; edit it to show your own user and logout path.
      # @return [void]
      def add_user_props_hook
        path = "app/controllers/madmin/application_controller.rb"
        return say("#{path} not found; run `rails g madmin:install` first.", :red) unless File.exist?(File.join(destination_root, path))

        return if File.read(File.join(destination_root, path)).include?("admin_user_props")

        inject_into_file path, before: /^  end\nend\s*\z/ do
          <<~RUBY.gsub(/^(?=.)/, "    ")

            private

            # Signed-in user and logout link for the React layout (required by madmin_inertia).
            # @return [Hash]
            def admin_user_props
              {user: {name: "Admin", email: ""}, logout: "/"}
            end
          RUBY
        end
      end

      # @return [void]
      def link_npm_package
        relative = Pathname.new(gem_root).relative_path_from(Pathname.new(destination_root))
        spec = (package_manager == "npm") ? "file:#{relative}" : "link:#{relative}"
        run "#{package_manager} #{(package_manager == "npm") ? "install" : "add"} @inertiajs/react react react-dom madmin-inertia@#{spec}"
      end

      # esbuild must resolve react from the app when bundling the linked package.
      # @return [void]
      def patch_build_script
        return unless File.exist?(File.join(destination_root, "package.json"))

        gsub_file "package.json", /"build": "esbuild /, '"build": "NODE_PATH=$PWD/node_modules esbuild '
      end

      # @return [void]
      def add_tailwind_source
        css = "app/assets/stylesheets/application.tailwind.css"
        return unless File.exist?(File.join(destination_root, css))

        return if File.read(File.join(destination_root, css)).include?("madmin-inertia")

        relative = Pathname.new(gem_root).relative_path_from(Pathname.new(File.join(destination_root, File.dirname(css))))
        append_to_file css, %(\n@source "#{relative}/app/javascript";\n@source "../../javascript";\n)
      end

      private

      # @return [String]
      def gem_root
        Gem.loaded_specs.fetch("madmin_inertia").full_gem_path
      end

      # @return [String]
      def package_manager
        @package_manager ||= if File.exist?(File.join(destination_root, "pnpm-lock.yaml")) then "pnpm"
        elsif File.exist?(File.join(destination_root, "yarn.lock")) then "yarn"
        elsif File.exist?(File.join(destination_root, "bun.lock")) then "bun"
        else "npm"
        end
      end
    end
  end
end
