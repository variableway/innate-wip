# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: ruby
# Normalized: ruby
# Block index: 16

class User < ApplicationRecord
  has_secure_password
  has_many :posts, dependent: :destroy
  
  validates :email, presence: true, uniqueness: true
  validates :password, length: { minimum: 8 }, if: :password_digest_changed?
  
  def generate_jwt_token
    JWT.encode({ user_id: id, exp: 24.hours.from_now.to_i }, 
               Rails.application.secrets.secret_key_base)
  end
end