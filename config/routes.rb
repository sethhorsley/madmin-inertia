Rails.application.routes.draw do
  namespace :madmin do
    get "settings", to: "settings#show"
  end
end
