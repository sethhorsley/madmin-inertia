require "rails/generators"

module MadminInertia
  module Generators
    # Shared by the views generators: copies a gem-owned React component into the app and
    # registers it with `start()` in app/javascript/madmin.jsx.
    module Ejectable
      ENTRY = "app/javascript/madmin.jsx"
      PAGES = File.expand_path("../../../app/javascript/pages", __dir__)

      # @return [void]
      def self.included(generator)
        generator.source_root(PAGES)
      end

      private

      # @param source [String] path under the gem's pages directory, e.g. "views/index.jsx"
      # @param destination [String] path under app/javascript/madmin
      # @param component [String] import name, e.g. "PostIndex"
      # @param register [String] the `start()` line that registers it, with its position marker
      # @return [void]
      def eject(source, destination, component, after:, entry_line:)
        target = "app/javascript/madmin/#{destination}"
        copy_file source, target do |content|
          content
            .gsub(%r{import (\w+), \{ (.*?) \} from "\.\.?/(?:field|filters|ui)"}, 'import { \1, \2 } from "madmin-inertia"')
            .gsub(%r{import (\w+) from "\.\.?/(?:field|filters)"}, 'import { \1 } from "madmin-inertia"')
            .gsub(%r{from "\.\.?/(?:field|filters|ui)"}, 'from "madmin-inertia"')
        end
        return say("#{ENTRY} not found; run `rails g madmin_inertia:install` first.", :red) unless File.exist?(File.join(destination_root, ENTRY))
        return if File.read(File.join(destination_root, ENTRY)).include?(entry_line)

        inject_into_file ENTRY, "import #{component} from \"./madmin/#{destination.delete_suffix(".jsx")}\"\n", after: /^import \{ start \}.*\n/
        inject_into_file ENTRY, entry_line, after: after
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
        eject "views/#{view}.jsx", key ? "views/#{key}/#{view}.jsx" : "views/#{view}.jsx", component_name(view),
          after: "  views: {\n", entry_line: key ? "    \"#{key}/#{view}\": #{component_name(view)},\n" : "    #{view}: #{component_name(view)},\n"
      end

      # @return [void]
      def eject_layout
        eject "layout.jsx", "layout.jsx", "Layout", after: "start({\n", entry_line: "  layout: Layout,\n"
      end

      # @return [void]
      def eject_dashboard
        eject "dashboard.jsx", "dashboard.jsx", "Dashboard", after: "start({\n", entry_line: "  dashboard: Dashboard,\n"
      end
    end
  end
end
