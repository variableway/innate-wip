# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: ruby
# Normalized: ruby
# Block index: 21

# test/models/post_test.rb
class PostTest < ActiveSupport::TestCase
  test "should validate presence of title" do
    post = Post.new(content: "Some content", published: true)
    assert_not post.valid?
    assert_includes post.errors[:title], "can't be blank"
  end
  
  test "should create post with valid attributes" do
    post = posts(:published_post) # fixture reference
    assert post.valid?
    assert post.published?
  end
  
  test "published scope should return only published posts" do
    published_count = Post.where(published: true).count
    assert_equal published_count, Post.published.count
  end
end