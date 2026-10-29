require_relative "../ejectable"

module MadminInertia
  module Generators
    module Views
      # rails g madmin_inertia:views:layout
      class LayoutGenerator < Rails::Generators::Base
        include Ejectable

        desc "Copies the layout component into app/javascript/madmin."

        # @return [void]
        def copy_layout
          eject_layout
        end
      end
    end
  end
end
