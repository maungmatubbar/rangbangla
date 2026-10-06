<?php

use App\Models\User;
use Illuminate\Support\Facades\Cache;

it('sends an otp for a valid phone number', function () {
    $this->post('/auth/phone/otp', ['phone' => '01712345678'])
        ->assertRedirect()
        ->assertSessionHas('otp');

    expect(Cache::get('otp:login:01712345678'))->not->toBeNull();
});

it('rejects an invalid phone number', function () {
    $this->post('/auth/phone/otp', ['phone' => '12345'])
        ->assertSessionHasErrors('phone');
});

it('registers and logs in a new user via otp', function () {
    $this->post('/auth/phone/otp', ['phone' => '01712345678']);
    $code = Cache::get('otp:login:01712345678');

    $this->post('/auth/phone/login', [
        'phone' => '01712345678',
        'code' => $code,
        'name' => 'Ayesha Rahman',
    ])->assertRedirect();

    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', [
        'phone' => '01712345678',
        'name' => 'Ayesha Rahman',
    ]);
    expect(User::where('phone', '01712345678')->first()->phone_verified_at)->not->toBeNull();
});

it('logs in an existing phone user without a name', function () {
    User::factory()->create(['phone' => '01812345678']);

    $this->post('/auth/phone/otp', ['phone' => '01812345678']);
    $code = Cache::get('otp:login:01812345678');

    $this->post('/auth/phone/login', ['phone' => '01812345678', 'code' => $code])
        ->assertRedirect();

    $this->assertAuthenticated();
});

it('requires a name for a brand-new phone user', function () {
    $this->post('/auth/phone/otp', ['phone' => '01912345678']);
    $code = Cache::get('otp:login:01912345678');

    $this->post('/auth/phone/login', ['phone' => '01912345678', 'code' => $code])
        ->assertSessionHasErrors('name');

    $this->assertGuest();
});

it('rejects an incorrect otp', function () {
    $this->post('/auth/phone/otp', ['phone' => '01712345678']);

    $this->post('/auth/phone/login', [
        'phone' => '01712345678',
        'code' => '000000',
        'name' => 'Nope',
    ])->assertSessionHasErrors('code');

    $this->assertGuest();
});
