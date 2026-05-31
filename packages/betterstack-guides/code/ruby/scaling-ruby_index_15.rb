# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 15

ActiveRecord::Base.transaction do
  user = User.create!(email: 'user@example.com')
  profile = Profile.create!(user: user, bio: 'Hello')
end

# Manual rollback
ActiveRecord::Base.transaction do
  user = User.create!(email: 'user@example.com')
  raise ActiveRecord::Rollback if external_service_fails?
end