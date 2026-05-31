# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: ruby
# Normalized: ruby
# Block index: 9

# Database migrations are built-in
class CreateProducts < ActiveRecord::Migration[7.0]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.decimal :price, precision: 8, scale: 2
      t.text :description
      t.boolean :available, default: true
      t.timestamps
    end
  end
end

# Models provide rich query interfaces
class Product < ApplicationRecord
  has_many :order_items
  has_many :orders, through: :order_items
  
  scope :expensive, -> { where('price > ?', 100) }
  scope :recent, -> { where('created_at > ?', 1.week.ago) }
end

# Controllers use ActiveRecord naturally
def bestsellers
  @products = Product.joins(:order_items)
                     .group('products.id')
                     .order('COUNT(order_items.id) DESC')
                     .limit(10)
end