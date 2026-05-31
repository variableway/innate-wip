# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: php
# Normalized: php
# Block index: 12

// Migration files define schema changes
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('email')->unique();
    $table->string('name');
    $table->timestamps();
});

// Factory classes generate test data
User::factory()->count(10)->create();

// Seeders populate your database
DB::table('users')->insert([
    'name' => 'Admin User',
    'email' => 'admin@example.com',
]);