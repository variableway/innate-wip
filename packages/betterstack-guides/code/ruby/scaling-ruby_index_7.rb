# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 7

class Users < ROM::Relation[:sql]
  schema(:users, infer: true)
  
  def active
    where(active: true)
  end
  
  def recent
    where { created_at > Time.now - 7*24*60*60 }
  end
end

class UserRepository < ROM::Repository[:users]
  def active_recent_users
    users.active.recent.to_a
  end
end

user_repo = UserRepository.new(container)
users = user_repo.active_recent_users