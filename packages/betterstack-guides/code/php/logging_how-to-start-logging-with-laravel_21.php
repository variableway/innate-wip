# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 21

[label routes/web.php]
. . .
Route::get("/user/{username}", function ($username) {
    $users = ["user1", "user2", "user3"];

    if (in_array($username, $users)) {
        return "User found!";
    } else {
        Log::error("User does not exist.");
        return "User does not exist.";
    }
});