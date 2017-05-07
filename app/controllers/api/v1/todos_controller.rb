class Api::V1::TodosController < ApplicationController
  before_filter :set_todo, only: [:update, :destroy, :update_status]

  def index
    @data = Todo.all.orderd
  end

  def create
    Todo.create(todo_params)
    @data = Todo.all.orderd
  end

  def update
    @todo.update(todo_params)
    @data = Todo.all.orderd
  end

  def update_status
    params[:todo][:status] = convert_status_to_int params[:todo][:status]
    @todo.update(todo_params)
    @data = Todo.all.orderd
  end

  def destroy

  end

  private

  def convert_status_to_int status
    Todo.statuses.each do |s|
      if (status == s.first)
        return s.second
      end
    end

  end

  # Use callbacks to share common setup or constraints between actions.
  def set_todo
    @todo = Todo.find_by_id(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def todo_params
    params.fetch(:todo, {}).permit(
        :name,
        :status,
        :order
    )
  end

end
