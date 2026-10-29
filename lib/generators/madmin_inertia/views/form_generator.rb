require_relative "../ejectable"

module MadminInertia
  module Generators
    module Views
      # rails g madmin_inertia:views:form [Model]
      class FormGenerator < Rails::Generators::Base
        include Ejectable

        desc "Copies the form view into app/javascript/madmin/views (per model when one is given)."
        argument :model, type: :string, required: false, desc: "Limit the override to one model, e.g. Post"

        # @return [void]
        def copy_form
          eject_view("form")
        end
      end
    end
  end
end
