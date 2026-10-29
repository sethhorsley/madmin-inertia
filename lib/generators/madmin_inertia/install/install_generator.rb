require "rails/generators"

module MadminInertia
  module Generators
    # rails g madmin_inertia:install
    #
    # Sets up the host app for Inertia-rendered Madmin: the JS entry, the linked npm package
    # and the Tailwind source path. Run `rails g madmin:install` first; eject pieces with
    # `rails g madmin_inertia:views`.
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path("templates", __dir__)

      # The gem ships the layout, dashboard and views; only this entry lives in the app.
      # @return [void]
      def add_entry
        copy_file "madmin.jsx", "app/javascript/madmin.jsx"
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
