# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: ruby
# Normalized: ruby
# Block index: 3

# app/models/product.rb
class Product < ApplicationRecord
  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  
  scope :available, -> { where(available: true) }
end