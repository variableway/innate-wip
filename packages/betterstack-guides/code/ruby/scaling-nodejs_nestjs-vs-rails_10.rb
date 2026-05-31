# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: ruby
# Normalized: ruby
# Block index: 10

class Post < ApplicationRecord
  belongs_to :user
  has_many_attached :images
  
  validates :title, presence: true, length: { minimum: 5 }
  validates :content, presence: true
  
  scope :published, -> { where(published: true) }
  scope :recent, ->(limit = 10) { order(created_at: :desc).limit(limit) }
  
  def excerpt(length = 200)
    content.truncate(length)
  end
end