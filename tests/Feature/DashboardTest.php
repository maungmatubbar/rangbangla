<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('customers are routed to their account overview', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('dashboard'))->assertRedirect(route('account.overview'));
});

test('admins are routed to the admin dashboard', function () {
    $this->actingAs(User::factory()->create(['is_admin' => true]));

    $this->get(route('dashboard'))->assertRedirect(route('admin.dashboard'));
});
