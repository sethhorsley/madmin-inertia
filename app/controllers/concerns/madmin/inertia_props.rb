# Props shared by every React page: menu, flash and upload endpoints.
module Madmin::InertiaProps
  private

  # @return [Hash]
  def admin_props
    navigation = []
    Madmin.menu.render do |item|
      navigation << {label: item.label, url: item.url, children: item.items.map { |child| {label: child.label, url: child.url} }}
    end
    {
      admin: {name: Madmin.site_name, dashboard: main_app.madmin_root_path, navigation: navigation}.merge(admin_user_props),
      flash: flash.to_hash.slice("notice", "alert"),
      uploads: uploads_props
    }
  end

  # Direct-upload endpoints for rich text and attachments; empty without Active Storage.
  # @return [Hash]
  def uploads_props
    return {} unless main_app.respond_to?(:rails_direct_uploads_path)

    {direct: main_app.rails_direct_uploads_path, blob: main_app.rails_service_blob_path(":signed_id", ":filename")}
  end

  # Host hook for the signed-in user and logout path.
  # @return [Hash]
  def admin_user_props
    {}
  end
end
