Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  root 'todo_management#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api, format: 'json' do
    namespace :v1  do
      resources :todos, :only => [:index,:create, :update, :destroy] do
        member do
          patch 'update_status'
        end
      end
    end
  end
end
