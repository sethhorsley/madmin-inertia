module MadminInertia
  # Swaps Madmin's ERB views for Inertia/React pages.
  #
  # Host contract: define `admin_user_props` (private) in Madmin::ApplicationController
  # returning `{user: {name:, email:}, logout: path}` and register the JS pages
  # (see `pages` in index.js) with createInertiaApp.
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
    end
  end
end
