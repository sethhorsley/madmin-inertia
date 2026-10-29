require_relative "../ejectable"

module MadminInertia
  module Generators
    module Views
      # rails g madmin_inertia:views:index [Model]
      class IndexGenerator < Rails::Generators::Base
        include Ejectable

        desc "Copies the index view into app/javascript/madmin/views (per model when one is given)."
        argument :model, type: :string, required: false, desc: "Limit the override to one model, e.g. Post"

        # @return [void]
        def copy_index
          eject_view("index")
        end
      end
    end
  end
end
