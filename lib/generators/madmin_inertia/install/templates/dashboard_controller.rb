# React entry point for the Madmin landing page.
class Madmin::DashboardController < Madmin::ApplicationController
  # GET /madmin
  # @return [void]
  def show
    render inertia: "Madmin/Dashboard", layout: "madmin/inertia", props: admin_props.merge(
      counts: Madmin.resources.reject { |resource| resource.menu_options == false }.map { |resource| {label: resource.friendly_name.pluralize, value: resource.model.count, url: resource.index_path} }
    )
  end
end
