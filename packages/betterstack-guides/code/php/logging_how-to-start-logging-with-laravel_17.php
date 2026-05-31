# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 17

[label routes/web.php]
<?php

use Illuminate\Support\Facades\Route;
[highlight]
use Illuminate\Support\Facades\Log;
[/highlight]


Route::get("/", function () {
    return view("welcome");
});

[highlight]
Route::get("/user", function () {
    Log::info("The route /user is being accessed.");
    return "This is the /user page.";
});
[/highlight]