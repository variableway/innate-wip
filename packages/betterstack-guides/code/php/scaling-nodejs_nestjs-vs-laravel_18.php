# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: php
# Normalized: php
# Block index: 18

public function test_post_belongs_to_author()
{
    $user = User::factory()->create();
    $post = Post::factory()->create(['author_id' => $user->id]);

    $this->assertInstanceOf(User::class, $post->author);
    $this->assertEquals($user->name, $post->author->name);
}

public function test_published_scope_filters_correctly()
{
    Post::factory()->create(['published' => true]);
    Post::factory()->create(['published' => false]);

    $published = Post::published()->get();
    
    $this->assertCount(1, $published);
    $this->assertTrue($published->first()->published);
}