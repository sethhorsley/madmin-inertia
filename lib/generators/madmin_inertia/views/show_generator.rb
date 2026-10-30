require_relative "../ejectable"

module MadminInertia
  module Generators
    module Views
      # rails g madmin_inertia:views:show [Model]
      class ShowGenerator < Rails::Generators::Base
        include Ejectable

        desc "Copies the show view into app/javascript/madmin/pages/resource (per model when one is given)."
        argument :model, type: :string, required: false, desc: "Limit the override to one model, e.g. Post"

        # @return [void]
        def copy_show
          eject_view("show")
        end
      end
    end
  end
end
