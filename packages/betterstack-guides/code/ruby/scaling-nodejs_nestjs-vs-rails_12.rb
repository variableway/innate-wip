# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: ruby
# Normalized: ruby
# Block index: 12

class AddTagsToPosts < ActiveRecord::Migration[7.0]
  def change
    create_table :tags do |t|
      t.string :name, null: false
      t.timestamps
    end
    
    create_join_table :posts, :tags
    add_index :tags, :name, unique: true
  end
end