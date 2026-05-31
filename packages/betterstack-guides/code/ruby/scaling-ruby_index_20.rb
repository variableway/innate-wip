# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 20

# Configure ROM in initializer
ROM_CONTAINER = ROM.container(:sql, ENV['DATABASE_URL']) do |config|
  config.register_relation(Users)
end

# Make repositories available
class ApplicationController < ActionController::Base
  def user_repo
    @user_repo ||= UserRepository.new(ROM_CONTAINER)
  end
end

# Controllers use repositories
class UsersController < ApplicationController
  def create
    result = user_repo.create_user(user_params)
    if result.is_a?(ROM::Struct)
      redirect_to user_path(result)
    else
      @errors = result.errors
      render :new
    end
  end
end