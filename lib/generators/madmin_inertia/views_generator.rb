require_relative "ejectable"

module MadminInertia
  module Generators
    # rails g madmin_inertia:views [Model]
    class ViewsGenerator < Rails::Generators::Base
      include Ejectable

      desc "Copies the layout, dashboard and index/show/form views into app/javascript/madmin."
      argument :model, type: :string, required: false, desc: "Limit the index/show/form overrides to one model, e.g. Post"

      # @return [void]
      def copy_all
        eject_layout
        eject_dashboard
        %w[index show form].each { |view| eject_view(view) }
      end
    end
  end
end
