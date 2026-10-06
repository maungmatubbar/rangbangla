<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

it('issues a token for valid credentials', function () {
    $user = User::factory()->create(['password' => Hash::make('secret-password')]);

    $this->postJson('/api/v1/auth/token', [
        'email' => $user->email,
        'password' => 'secret-password',
        'device_name' => 'test-device',
    ])
        ->assertCreated()
        ->assertJsonStructure(['token', 'token_type']);
});

it('rejects invalid credentials', function () {
    $user = User::factory()->create();

    $this->postJson('/api/v1/auth/token', [
        'email' => $user->email,
        'password' => 'wrong-password',
        'device_name' => 'test-device',
    ])->assertStatus(422);
});

it('accepts the issued token on protected routes', function () {
    $user = User::factory()->create(['password' => Hash::make('secret-password')]);

    $token = $this->postJson('/api/v1/auth/token', [
        'email' => $user->email,
        'password' => 'secret-password',
        'device_name' => 'test-device',
    ])->json('token');

    $this->withToken($token)->getJson('/api/v1/products')->assertOk();
});
