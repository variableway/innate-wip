# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: ruby
# Normalized: ruby
# Block index: 22

# test/controllers/posts_controller_test.rb
class PostsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:john)
    @post = posts(:published_post)
  end

  test "should get index" do
    get posts_url
    assert_response :success
    assert_includes response.body, @post.title
  end
  
  test "should create post when authenticated" do
    sign_in @user
    
    assert_difference('Post.count') do
      post posts_url, params: { 
        post: { 
          title: 'New Post', 
          content: 'Post content',
          published: true 
        }
      }
    end
    
    assert_redirected_to post_url(Post.last)
  end
  
  test "should require authentication for create" do
    assert_no_difference('Post.count') do
      post posts_url, params: { 
        post: { title: 'Unauthorized Post' }
      }
    end
    
    assert_redirected_to login_url
  end
end