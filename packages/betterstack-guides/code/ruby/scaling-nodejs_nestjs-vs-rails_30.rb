# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: ruby
# Normalized: ruby
# Block index: 30

class UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    
    if @user.save
      # Queue welcome email to be sent asynchronously
      WelcomeEmailJob.perform_later(@user)
      
      render json: @user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end
end