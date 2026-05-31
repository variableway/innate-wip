# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: php
# Normalized: php
# Block index: 17

class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_post()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
                         ->postJson('/api/posts', [
                             'title' => 'Test Post',
                             'content' => 'This is test content for the post.'
                         ]);
                         
        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'Test Post']);
                 
        $this->assertDatabaseHas('posts', [
            'title' => 'Test Post',
            'author_id' => $user->id
        ]);
    }

    public function test_validates_required_fields()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
                         ->postJson('/api/posts', ['title' => '']);
                         
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title', 'content']);
    }

    public function test_user_cannot_edit_others_posts()
    {
        $author = User::factory()->create();
        $otherUser = User::factory()->create();
        $post = Post::factory()->create(['author_id' => $author->id]);

        $response = $this->actingAs($otherUser)
                         ->patchJson("/api/posts/{$post->id}", [
                             'title' => 'Hacked title'
                         ]);

        $response->assertStatus(403);
    }
}