# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 13

ROM::SQL.migration do
  change do
    create_table :users do
      primary_key :id
      String :email, null: false
      String :username, null: false
      DateTime :created_at
      DateTime :updated_at
      
      index :email, unique: true
    end
  end
end