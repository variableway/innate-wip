# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: ruby
# Normalized: ruby
# Block index: 4

[label app/controllers/products_controller.rb]
class ProductsController < ApplicationController
  def index
    @products = Product.available
  end
  
  def show
    @product = Product.find(params[:id])
  end
  
  def create
    @product = Product.new(product_params)
    if @product.save
      redirect_to @product, notice: 'Product created successfully'
    else
      render :new
    end
  end
  
  private
  
  def product_params
    params.require(:product).permit(:name, :price, :description)
  end
end