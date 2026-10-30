# Settings page opened from the sidebar's profile menu.
class Madmin::SettingsController < Madmin::ApplicationController
  # GET /madmin/settings
  # @return [void]
  def show
    render inertia: "Madmin/Settings", layout: "madmin/inertia", props: admin_props
  end
end
