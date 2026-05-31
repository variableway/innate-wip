# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: ruby
# Normalized: ruby
# Block index: 16

[label test/models/product_test.rb]
require 'test_helper'

class ProductTest < ActiveSupport::TestCase
  test "should not save product without name" do
    product = Product.new(price: 10.99)
    assert_not product.save
    assert_includes product.errors.full_messages, "Name can't be blank"
  end
  
  test "should calculate total with tax" do
    product = Product.new(name: "Test", price: 100)
    assert_equal 108.25, product.total_with_tax(0.0825)
  end
end