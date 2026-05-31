# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: php
# Normalized: php
# Block index: 14

// Built-in authentication scaffolding
php artisan make:auth
php artisan migrate

// API token authentication with Sanctum
class AuthController extends Controller
{
    public function login(Request $request)
    {
        if (Auth::attempt($request->only('email', 'password'))) {
            $token = auth()->user()->createToken('api-token')->plainTextToken;
            return response()->json(['token' => $token]);
        }
        
        return response()->json(['error' => 'Invalid credentials'], 401);
    }
}

// Protect routes with middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);
});

class PostController extends Controller
{
    public function update(UpdatePostRequest $request, Post $post)
    {
        // Authorization happens automatically via policies
        $this->authorize('update', $post);
        
        $post->update($request->validated());
        return new PostResource($post);
    }
}

// Authorization policies read like natural language
class PostPolicy
{
    public function update(User $user, Post $post)
    {
        return $user->id === $post->author_id;
    }
    
    public function delete(User $user, Post $post)
    {
        return $user->id === $post->author_id || $user->isAdmin();
    }
}