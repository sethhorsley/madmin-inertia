# Shared React rendering for the gem controller; resource subclasses keep their hooks.
module Madmin::InertiaResources
  # GET /madmin/:resource
  # @return [void]
  def index
    return super if request.format.json?

    @page, @records = paginate_collection(scoped_resources)
    render_resource("index")
  end

  # POST /madmin/:resource
  # @return [void]
  def create
    @record = resource.model.new
    save_resource("new")
  end

  # PATCH /madmin/:resource/:id
  # @return [void]
  def update
    save_resource("edit")
  end

  # DELETE /madmin/:resource/:id
  # @return [void]
  def destroy
    if @record.destroy
      redirect_to resource.index_path, status: :see_other
    else
      redirect_to resource.show_path(@record), status: :see_other, alert: @record.errors.full_messages.to_sentence.presence || "Could not delete this record."
    end
  end

  private

  # Runs after inherited new/edit/show actions, including subclass customizations.
  # @return [void]
  def default_render(*)
    %w[new edit show].include?(action_name) ? render_resource(action_name) : super
  end

  # @return [void]
  def save_resource(page)
    @record.assign_attributes(resource_params)
    if @record.save
      redirect_to resource.show_path(@record), status: :see_other
    else
      render_resource(page)
    end
  rescue JSON::ParserError
    @record.errors.add(:base, "Enter valid JSON in JSON and array fields.")
    render_resource(page)
  end

  # Uses field permissions, including new/edit visibility, before decoding JSON.
  # @return [ActionController::Parameters]
  def resource_params
    fields = resource_fields(action_name).reject { |field| readonly_field?(field) }
    values = params.require(resource.param_key).permit(*fields.map(&:to_param))
    fields.each do |field|
      key = field.to_param.is_a?(Hash) ? field.to_param.keys.first.to_s : field.to_param.to_s
      next unless values.key?(key)
      if json_field?(field) && values[key].is_a?(String)
        values[key] = JSON.parse(values[key])
        raise JSON::ParserError, "Expected an array" if resource.model.columns_hash[field.attribute_name.to_s].try(:array) && !values[key].is_a?(Array)
      elsif field.class.field_type == "attachments"
        values[key] = @record.public_send(field.attribute_name).blobs.map(&:signed_id) + values[key]
      elsif field.class.field_type == "password" && values[key].blank?
        values.delete(key)
      end
    end
    values.to_h.transform_values { |value| (value.is_a?(Hash) && value["type"] == "polymorphic") ? GlobalID::Locator.locate(value["value"]) : value }
  end

  # @return [Array<Madmin::Field>]
  def resource_fields(page)
    resource.attributes.values.map(&:field).select do |field|
      field.visible?(page) && !sensitive_field?(field)
    end
  end

  # Stored credentials must never enter page props or be writable through forms.
  # @return [Boolean]
  def sensitive_field?(field)
    field.class.field_type != "password" && field.attribute_name.to_s.match?(/password|token|secret|otp_backup|ssn/i)
  end

  # PostgreSQL arrays need JSON round-tripping even when Madmin infers :string.
  # @return [Boolean]
  def json_field?(field)
    field.class.field_type == "json" || resource.model.columns_hash[field.attribute_name.to_s].try(:array)
  end

  # @return [void]
  def render_resource(page)
    fields = resource_fields(page)
    props = {
      mode: page,
      resource: {name: resource.friendly_name, label: resource.friendly_name.pluralize, key: resource.param_key},
      urls: {index: resource.index_path, new: resource.new_path},
      fields: fields.map { |field| field_props(field, page) },
      errors: @record&.errors&.to_hash(true) || {}
    }
    if page == "index"
      props.merge!(
        records: @records.map { |record| record_props(record, fields) },
        filters: {q: search_term, sort: sort_column, direction: sort_direction, scope: valid_scope},
        filter_columns: resource.filterable_attributes.map { |attribute| {name: attribute.name, label: attribute.field.label, type: attribute.field.filter_type} },
        filter_operators: Madmin::Filter::OPERATORS.to_h { |type, operators| [type, operators.map { |operator| {value: operator, label: helpers.t("madmin.filters.operators.#{type}.#{operator}"), valueless: Madmin::Filter::WITHOUT_VALUE.include?(operator)} }] },
        active_filters: filters.map(&:to_h),
        scopes: [:all, *resource.scopes].uniq.map { |scope| {value: scope, label: scope.to_s.humanize} },
        pagination: {page: @page.page, pages: @page.last, count: @page.count, previous: @page.prev, next: @page.next}
      )
    else
      props[:record] = record_props(@record, fields, form: %w[new edit].include?(page))
    end
    render inertia: "Madmin/Resource", layout: "madmin/inertia", props: admin_props.merge(props)
  end

  # @return [Hash]
  def field_props(field, page)
    type = json_field?(field) ? "json" : field.class.field_type
    parameter = field.to_param
    props = {name: field.attribute_name, key: parameter.is_a?(Hash) ? parameter.keys.first : parameter, type: type, label: field.label, required: field.required?, description: field.options[:description], sortable: resource.sortable_columns.include?(field.attribute_name.to_s)}
    return props unless %w[new edit].include?(page)

    if %w[belongs_to has_many].include?(type)
      related = "#{resource.model.reflect_on_association(field.attribute_name).klass.name}Resource".safe_constantize
      unless related
        return props.merge(type: "integer", description: "Enter the associated record ID.") if type == "belongs_to"
        return props.merge(readonly: true, description: "The related Madmin resource is not registered.")
      end
    end
    if field.respond_to?(:options_for_select)
      props[:options] = field.options_for_select(@record).to_a.map do |option|
        if type == "polymorphic"
          {label: option.to_global_id.to_s, value: option.to_global_id.to_s}
        else
          label, value = option.is_a?(Array) ? option : [option, option]
          {label: label.to_s, value: value.to_s}
        end
      end
    end
    props[:lookup] = field.index_path if field.respond_to?(:index_path)
    props[:readonly] = readonly_field?(field)
    props
  rescue ActiveRecord::InverseOfAssociationNotFoundError => error
    props.merge(readonly: true, description: error.message)
  end

  # @return [Boolean]
  def readonly_field?(field)
    type = field.class.field_type
    parameter = field.to_param.is_a?(Hash) ? field.to_param.keys.first : field.to_param
    type == "has_one" || !@record.respond_to?("#{parameter}=") && !%w[polymorphic attachment attachments].include?(type) || json_field?(field) && filtered_json(field.value(@record)) != field.value(@record)
  end

  # @return [Hash]
  def record_props(record, fields, form: false)
    {
      id: record.persisted? ? record.to_param : nil,
      label: record.persisted? ? resource.display_name(record) : "New #{resource.friendly_name}",
      url: record.persisted? ? resource.show_path(record) : resource.index_path,
      edit_url: record.persisted? ? resource.edit_path(record) : nil,
      values: fields.to_h { |field| [field.attribute_name, field_value(field, record, form)] }
    }
  end

  # Converts values explicitly; never serializes whole associated models.
  # @return [Object]
  def field_value(field, record, form)
    value = (form && !record.persisted? && record.has_attribute?(field.attribute_name)) ? record[field.attribute_name] : field.value(record)
    type = field.class.field_type
    return "" if type == "password"
    if form
      return JSON.pretty_generate(filtered_json(value)) if json_field?(field)
      case type
      when "belongs_to" then return value&.id&.to_s || ""
      when "has_many" then return value.map { |item| item.id.to_s }
      when "polymorphic" then return value&.to_global_id&.to_s || ""
      when "rich_text" then return value&.body&.to_html.to_s
      when "datetime", "date_time" then return value&.utc&.strftime("%Y-%m-%dT%H:%M:%S")
      when "date" then return value&.strftime("%Y-%m-%d")
      when "time" then return value&.strftime("%H:%M:%S")
      end
    end
    case type
    when "belongs_to", "has_one", "polymorphic"
      {links: [value].compact.map { |item| association_link(item) }}
    when "has_many", "nested_has_many"
      pagination, items = field.paginated_value(record, params)
      {links: items.map { |item| association_link(item) }, next_url: association_page_url(field, pagination.next), previous_url: association_page_url(field, pagination.prev)}
    when "rich_text"
      {html: helpers.sanitize(value.to_s)}
    when "attachment", "attachments"
      attachments = (type == "attachment") ? [value.attachment].compact : value.attachments.to_a
      {links: attachments.map { |attachment| {label: attachment.filename.to_s, url: main_app.rails_blob_path(attachment, disposition: "attachment"), external: true} }}
    when "file"
      value.to_s
    else
      case value
      when ::ActiveRecord::Base then {links: [association_link(value)]}
      when Hash, Array then filtered_json(value)
      when String, Numeric, TrueClass, FalseClass, NilClass, Date, Time, ActiveSupport::TimeWithZone then value
      else value.to_s
      end
    end
  rescue ActiveRecord::InverseOfAssociationNotFoundError => error
    {error: error.message}
  end

  # @return [Object]
  def filtered_json(value)
    ActiveSupport::ParameterFilter.new(Rails.application.config.filter_parameters + [:secret, :ssn]).filter({value: value})[:value]
  end

  # @return [String, nil]
  def association_page_url(field, page)
    "#{request.path}?#{request.query_parameters.merge("#{field.attribute_name}_page" => page).to_query}" if page
  end

  # @return [Hash]
  def association_link(record)
    related = Madmin.resource_for(record)
    {label: related.display_name(record), url: related.show_path(record)}
  rescue Madmin::MissingResource
    {label: "#{record.class.model_name.human} ##{record.id}"}
  end
end
