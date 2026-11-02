Rails.application.routes.draw do
  namespace :madmin do
    get "settings", to: "settings#show"
    get "search", to: "search#show"
  end
end
