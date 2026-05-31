# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 16

class UserRepository < ROM::Repository[:users]
  def create_user_with_profile(user_attrs, profile_attrs)
    users.transaction do
      user = users.command(:create).call(user_attrs)
      profile = profiles.command(:create).call(
        profile_attrs.merge(user_id: user.id)
      )
      [user, profile]
    end
  end
end

user, profile = user_repo.create_user_with_profile(
  { email: 'user@example.com' },
  { bio: 'Hello world' }
)