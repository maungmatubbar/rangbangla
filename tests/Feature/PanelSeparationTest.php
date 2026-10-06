<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia;

it('redirects admins away from the customer account panel', function () {
    $this->actingAs(User::factory()->create(['is_admin' => true]));

    $this->get('/account')->assertRedirect(route('admin.dashboard'));
    $this->get('/account/addresses')->assertRedirect(route('admin.dashboard'));
    $this->get('/wishlist')->assertRedirect(route('admin.dashboard'));
    $this->get('/orders')->assertRedirect(route('admin.dashboard'));
});

it('lets customers use their account panel', function () {
    $this->actingAs(User::factory()->create(['is_admin' => false]));

    $this->get('/account')->assertOk();
    $this->get('/wishlist')->assertOk();
    $this->get('/orders')->assertOk();
});

it('still lets admins reach their own settings', function () {
    $this->actingAs(User::factory()->create(['is_admin' => true]));

    $this->get('/settings/profile')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('settings/profile'));
});
