# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 22

[label routes/web.php]
. . .
Route::get("/user", function () {
    [highlight]
    Log::channel("info")->info("The route /user is being accessed.");
    [/highlight]
    return "This is the /user page.";
});