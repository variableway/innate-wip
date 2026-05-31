# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 23

[label routes/web.php]
. . .
Route::get("/user/{username}", function ($username) {
    [highlight]
    Log::info("The route /user is being accessed.", ["username" => $username]);
    [/highlight]
    return "The route /user is being accessed.";
});