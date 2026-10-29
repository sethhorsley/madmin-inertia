# Default React dashboard: a card per Madmin resource with its record count.
module Madmin::InertiaDashboard
  # GET /madmin
  # @return [void]
  def show
    counts = Madmin.resources.reject { |resource| resource.menu_options == false }.map do |resource|
      {label: resource.friendly_name.pluralize, value: resource.model.count, url: resource.index_path}
    end
    render inertia: "Madmin/Dashboard", layout: "madmin/inertia", props: admin_props.merge(counts: counts)
  end
end
