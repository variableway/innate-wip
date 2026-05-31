# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: ruby
# Normalized: ruby
# Block index: 11

# Find published posts with authors
@posts = Post.includes(:user)
             .published
             .recent
             
# Create a new post
@post = current_user.posts.create(
  title: "New Post",
  content: "Post content here",
  published: true
)

# Complex queries with conditions
@featured_posts = Post.joins(:user)
                     .where("posts.created_at > ? AND users.verified = ?", 
                            1.week.ago, true)
                     .published