# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 49

class OrdersController < ApplicationController
  def show
    @order = Order.find(params[:id])
    render json: @order
  end

[highlight]
  def append_info_to_payload(payload)
    super
    payload[:order_id] = @order&.id
    payload[:customer_id] = @order&.customer_id
    payload[:total_amount] = @order&.total_amount
    payload[:payment_status] = @order&.payment_status
  end
[/highlight]
end