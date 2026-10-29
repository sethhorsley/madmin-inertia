module MadminInertia
  # Swaps Madmin's ERB views for Inertia/React pages.
  #
  # Optional host hook: define `admin_user_props` (private) in Madmin::ApplicationController
  # returning `{user: {name:, email:}, logout: path}` to show the signed-in user.
  class Engine < ::Rails::Engine
    initializer "madmin_inertia.inertia" do
      InertiaRails.configure do |config|
        config.always_include_errors_hash = true
        config.use_script_element_for_initial_page = true
      end
    end

    config.to_prepare do
      Madmin::BaseController.include(Madmin::InertiaProps)
      Madmin::ResourceController.prepend(Madmin::InertiaResources)
      # An app-defined Madmin::DashboardController#show wins over the gem's.
      unless Madmin::DashboardController.instance_method(:show).source_location&.first.to_s.start_with?(Rails.root.to_s)
        Madmin::DashboardController.prepend(Madmin::InertiaDashboard)
      end
    end
  end
end
