# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 17

RSpec.describe User, type: :model do
  it 'validates email presence' do
    user = User.new(email: nil)
    expect(user).not_to be_valid
  end
  
  it 'creates user with associations' do
    user = User.create!(email: 'user@example.com')
    post = user.posts.create!(title: 'Hello')
    expect(user.posts).to include(post)
  end
end