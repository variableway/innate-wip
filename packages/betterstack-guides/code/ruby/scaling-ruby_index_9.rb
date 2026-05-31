# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 9

class Users < ROM::Relation[:sql]
  schema(:users, infer: true) do
    associations do
      has_many :posts
    end
  end
end

class UserRepository < ROM::Repository[:users]
  def find_with_posts(id)
    users.combine(:posts).by_pk(id).one!
  end
  
  def all_with_posts
    users.combine(:posts).to_a
  end
end

user_repo = UserRepository.new(container)
user = user_repo.find_with_posts(1)
user.posts.each { |post| puts post.title }