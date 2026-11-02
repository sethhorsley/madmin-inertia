# Default React dashboard: a card per Madmin resource with its record count, and an activity chart for one model.
module Madmin::InertiaDashboard
  CHART_DAYS = 90

  # GET /madmin
  # @return [void]
  def show
    resources = Madmin.resources.reject { |resource| resource.menu_options == false }
    counts = resources.map { |resource| {label: resource.friendly_name.pluralize, value: resource.model.count, url: resource.index_path} }
    render inertia: "Madmin/Dashboard", layout: "madmin/inertia", props: admin_props.merge(counts: counts, chart: activity_chart(resources))
  end

  private

  # Records created and updated per day for the first resource with timestamps; nil when none has them.
  # ponytail: first resource wins and days use the DB's date(); make it configurable if hosts want a different model or zone.
  # @return [Hash, nil] {label:, data: [{date:, created:, updated:}]}
  def activity_chart(resources)
    resource = resources.find { |candidate| (%w[created_at updated_at] - candidate.model.column_names).empty? }
    return unless resource

    days = (CHART_DAYS - 1).days.ago.to_date..Date.current
    per_day = %w[created_at updated_at].map do |column|
      resource.model.where(column => days.first.beginning_of_day..).group(Arel.sql("DATE(#{resource.model.connection.quote_column_name(column)})")).count.transform_keys(&:to_s)
    end
    data = days.map { |day| {date: day.to_s, created: per_day[0][day.to_s] || 0, updated: per_day[1][day.to_s] || 0} }
    {label: resource.friendly_name.pluralize, data: data}
  end
end
