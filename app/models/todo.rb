class Todo < ApplicationRecord
  scope :orderd, -> { order(:order) }
  scope :is_unexecuted, -> { where(status: Todo.statuses[:unexecuted] ) }
  scope :is_doing, -> { where(status: Todo.statuses[:doing] ) }
  scope :is_done, -> { where(status: Todo.statuses[:done] ) }
  scope :orderd, -> { order(:order) }

  enum status: { unexecuted: 0,doing: 1, done: 2}
end
