# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: php
# Normalized: php
# Block index: 11

class User extends Model
{
    protected $fillable = ['name', 'email'];
    
    protected $hidden = ['password'];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    
    public function publishedPosts()
    {
        return $this->posts()->where('published', true);
    }
}

// Usage reads like English
$user = User::where('email', $email)->first();
$posts = $user->posts()->published()->latest()->get();
$count = $user->publishedPosts()->count();