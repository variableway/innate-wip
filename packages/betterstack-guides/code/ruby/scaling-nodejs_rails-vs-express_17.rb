# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: ruby
# Normalized: ruby
# Block index: 17

[label test/controllers/products_controller_test.rb]
require 'test_helper'

class ProductsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get products_url
    assert_response :success
    assert_select 'h1', 'Products'
  end
  
  test "should create product when authenticated" do
    sign_in users(:admin)
    assert_difference('Product.count') do
      post products_url, params: { product: { name: 'New Product', price: 25.99 } }
    end
    assert_redirected_to product_url(Product.last)
  end
end