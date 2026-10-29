require_relative "../ejectable"

module MadminInertia
  module Generators
    module Views
      # rails g madmin_inertia:views:dashboard
      class DashboardGenerator < Rails::Generators::Base
        include Ejectable

        desc "Copies the dashboard component into app/javascript/madmin."

        # @return [void]
        def copy_dashboard
          eject_dashboard
        end
      end
    end
  end
end
