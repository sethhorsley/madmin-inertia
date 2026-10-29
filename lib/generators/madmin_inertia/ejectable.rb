require "rails/generators"

module MadminInertia
  module Generators
    # Shared by the views generators: copies a gem-owned component into the app and registers it.
    #
    # Needs a package.json (jsbundling-rails with esbuild): the JSX source is copied into the app and
    # registered with `start()` in app/javascript/madmin.jsx. Importmap apps have no compiler for JSX.
    module Ejectable
      ENTRY = "app/javascript/madmin.jsx"
      PAGES = File.expand_path("../../../app/javascript/pages", __dir__)

      # @return [void]
      def self.included(generator)
        generator.source_root(PAGES)
      end

      private

      # @param name [String] component path without extension, e.g. "views/post/index"
      # @param component [String] import name, e.g. "PostIndex"
      # @param root [Boolean] true for layout/dashboard, false for entries inside `views: {}`
      # @param line [String] the registration line
      # @return [void]
      def eject(name, component, root:, line:)
        raise Thor::Error, "Customizing views needs a JS bundler, and this app has no package.json. Add jsbundling-rails with esbuild (`bin/rails javascript:install:esbuild`) and run this again." unless File.exist?(File.join(destination_root, "package.json"))

        invoke "madmin_inertia:bundle" unless File.exist?(File.join(destination_root, ENTRY))
        copy_file "#{generic(name)}.jsx", "app/javascript/madmin/#{name}.jsx" do |content|
          content
            .gsub(%r{import (\w+), \{ (.*?) \} from "\.\.?/(?:field|filters|ui)"}, 'import { \1, \2 } from "madmin-inertia"')
            .gsub(%r{import (\w+) from "\.\.?/(?:field|filters)"}, 'import { \1 } from "madmin-inertia"')
            .gsub(%r{from "\.\.?/(?:field|filters|ui)"}, 'from "madmin-inertia"')
        end
        register ENTRY, "import #{component} from \"./madmin/#{name}\"\n", {after: /^import \{ start \}.*\n/}, line,
          root ? "start({\n" : "  views: {\n"
      end

      # Adds the import and the registration line to the entry file, once.
      # @return [void]
      def register(file, import_line, import_position, line, marker)
        return if File.read(File.join(destination_root, file)).include?(line)

        inject_into_file file, import_line, **import_position
        inject_into_file file, line, after: marker
      end

      # "views/post/index" => "views/index": the gem ships one source per view, not per model.
      def generic(name)
        name.sub(%r{\Aviews/[^/]+/}, "views/")
      end

      # @return [String] the resource's param key ("Admin::User" => "admin_user"), or nil
      def resource_key
        model.to_s.underscore.tr("/", "_").presence
      end

      # @return [String] "Post" + "Index" => "PostIndex"
      def component_name(view)
        "#{model.to_s.gsub("::", "")}#{view.capitalize}"
      end

      # @param view [String] "index", "show" or "form"
      # @return [void]
      def eject_view(view)
        key = resource_key
        eject key ? "views/#{key}/#{view}" : "views/#{view}", component_name(view), root: false,
          line: key ? "    \"#{key}/#{view}\": #{component_name(view)},\n" : "    #{view}: #{component_name(view)},\n"
      end

      # @return [void]
      def eject_layout
        eject "layout", "Layout", root: true, line: "  layout: Layout,\n"
      end

      # @return [void]
      def eject_dashboard
        eject "dashboard", "Dashboard", root: true, line: "  dashboard: Dashboard,\n"
      end
    end
  end
end
