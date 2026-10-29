require "rails/generators"

module MadminInertia
  module Generators
    # rails g madmin_inertia:install
    #
    # Checks the app is ready. The admin runs from the gem's prebuilt bundle, so there is no JS
    # setup until you customize with `rails g madmin_inertia:views`. Run `rails g madmin:install` first.
    class InstallGenerator < Rails::Generators::Base
      # @return [void]
      def check_prerequisites
        raise Thor::Error, "Madmin isn't installed. Run `rails g madmin:install` first." unless File.exist?(File.join(destination_root, "config/routes/madmin.rb"))

        say("Madmin needs Active Storage (and Active Job) loaded in config/application.rb.", :yellow) unless defined?(ActiveStorage::Blob)
      end

      # @return [void]
      def show_next_steps
        say "\nmadmin_inertia is ready: visit /madmin (no JS build needed).", :green
        say "Customize the layout, dashboard or views with `rails g madmin_inertia:views` (esbuild only)."
      end
    end
  end
end
