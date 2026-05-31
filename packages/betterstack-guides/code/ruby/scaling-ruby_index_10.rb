# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 10

class User < ActiveRecord::Base
  validates :email, presence: true, uniqueness: true
  validates :username, presence: true, length: { minimum: 3 }
  
  before_save :normalize_email
  
  private
  
  def normalize_email
    self.email = email.downcase.strip if email.present?
  end
end

user = User.new(email: 'INVALID')
user.save  # => false
user.errors.full_messages