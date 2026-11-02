# Records matching a term across every resource, for the command palette.
class Madmin::SearchController < Madmin::ApplicationController
  MIN_LENGTH = 2
  PER_RESOURCE = 5
  # ponytail: Postgres only (SET LOCAL statement_timeout); other databases search every table to completion.
  TABLE_TIMEOUT_MS = 500

  # GET /madmin/search?q=term
  # @return [void]
  def show
    render json: {results: term.length < MIN_LENGTH ? [] : results}
  end

  private

  # @return [String]
  def term
    params[:q].to_s.strip
  end

  # Uses the same knobs as the resource's own index search: `menu false` hides a resource,
  # `attribute :name, searchable: false` drops a field, `display_name(record)` titles a hit, and
  # `def self.command_palette? = false` leaves a resource out of the palette only.
  # @return [Array<Hash>] {group:, label:, url:}, grouped by resource in menu order
  def results
    Madmin.resources.flat_map do |resource|
      next [] unless searchable?(resource)

      hits(resource).map { |record| {group: resource.friendly_plural_name, label: resource.display_name(record), url: resource.show_path(record)} }
    end
  end

  # @param resource [Class<Madmin::Resource>]
  # @return [Boolean]
  def searchable?(resource)
    resource.menu_options != false && resource.searchable_attributes.any? && resource.route?(:show) &&
      (!resource.respond_to?(:command_palette?) || resource.command_palette?)
  end

  # A slow or failing table (a huge events table, a broken scope) is skipped rather than slowing or breaking the palette.
  # @return [Array<ActiveRecord::Base>]
  def hits(resource)
    resource.model.transaction do
      resource.model.connection.execute("SET LOCAL statement_timeout = #{TABLE_TIMEOUT_MS}") if resource.model.connection.adapter_name.match?(/postg/i)
      Madmin::Search.new(resource.model.all, resource, term).run.limit(PER_RESOURCE).to_a
    end
  rescue ActiveRecord::StatementInvalid => error
    Rails.logger.info("Madmin palette skipped #{resource.model.name}: #{error.class}")
    []
  end
end
