# Records matching a term across every resource, for the command palette.
class Madmin::SearchController < Madmin::ApplicationController
  MIN_LENGTH = 2
  PER_RESOURCE = 5
  # ponytail: Postgres only (SET LOCAL statement_timeout); other databases search every table to completion.
  TABLE_TIMEOUT_MS = 500

  # Madmin's index search limited to the attributes marked `search: true`, and nothing else. The mark works on any
  # column (it is cast to text), so a time or a number can be searched too.
  class Query < Madmin::Search
    # @param resource [Class<Madmin::Resource>]
    # @return [Array<Madmin::Resource::Attribute>] marked attributes that are real columns on the model
    def self.attributes_for(resource)
      resource.attributes.values.select { |attribute| attribute.field.options[:search] && resource.model_column_names.include?(attribute.name.to_s) }
    end

    private

    def search_attributes
      self.class.attributes_for(@resource)
    end
  end

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
  # `attribute :name, search: true` is the only way a column is searched (a resource with none is skipped), `display_name(record)` titles a hit, and
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
    resource.menu_options != false && Query.attributes_for(resource).any? && resource.route?(:show) &&
      (!resource.respond_to?(:command_palette?) || resource.command_palette?)
  end

  # A slow or failing table (a huge events table, a broken scope) is skipped rather than slowing or breaking the palette.
  # @return [Array<ActiveRecord::Base>]
  def hits(resource)
    resource.model.transaction do
      resource.model.connection.execute("SET LOCAL statement_timeout = #{TABLE_TIMEOUT_MS}") if resource.model.connection.adapter_name.match?(/postg/i)
      Query.new(resource.model.all, resource, term).run.limit(PER_RESOURCE).to_a
    end
  rescue ActiveRecord::StatementInvalid => error
    Rails.logger.info("Madmin palette skipped #{resource.model.name}: #{error.class}")
    []
  end
end
