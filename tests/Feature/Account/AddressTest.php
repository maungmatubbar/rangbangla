<?php

use App\Models\Address;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

it('requires auth to view addresses', function () {
    $this->get('/account/addresses')->assertRedirect('/login');
});

it('shows the account overview', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/account')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('account/overview')
            ->has('stats')
            ->has('recentOrders'));
});

it('stores an address and makes the first one default', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/account/addresses', [
        'name' => 'Ayesha Rahman',
        'phone' => '01712345678',
        'address' => '12 Gulshan Ave',
        'city' => 'Dhaka',
        'district' => 'Dhaka',
    ])->assertRedirect();

    $this->assertDatabaseHas('addresses', [
        'user_id' => $user->id,
        'name' => 'Ayesha Rahman',
        'is_default' => true,
    ]);
});

it('switches the default address', function () {
    $user = User::factory()->create();
    $a = Address::factory()->for($user)->default()->create();
    $b = Address::factory()->for($user)->create();

    $this->actingAs($user)->patch("/account/addresses/{$b->id}/default")->assertRedirect();

    expect($a->fresh()->is_default)->toBeFalse();
    expect($b->fresh()->is_default)->toBeTrue();
});

it('deletes an address', function () {
    $user = User::factory()->create();
    $address = Address::factory()->for($user)->create();

    $this->actingAs($user)->delete("/account/addresses/{$address->id}")->assertRedirect();

    $this->assertDatabaseMissing('addresses', ['id' => $address->id]);
});

it('forbids managing another users address', function () {
    $user = User::factory()->create();
    $other = Address::factory()->for(User::factory())->create();

    $this->actingAs($user)->delete("/account/addresses/{$other->id}")->assertForbidden();
});
