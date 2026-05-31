# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 4

class User < ActiveRecord::Base
  validates :email, presence: true, uniqueness: true
  has_many :posts
  
  def full_name
    "#{first_name} #{last_name}"
  end
end

user = User.create(email: 'user@example.com', username: 'johndoe')
user.email = 'newemail@example.com'
user.save