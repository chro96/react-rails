Rails.application.routes.draw do
  root 'todo_management#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api, format: 'json' do
    namespace :v1  do
      resources :todos, :only => [:index, :update, :destroy]
    end
  end
end
