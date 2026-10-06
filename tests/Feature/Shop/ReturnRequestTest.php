<?php

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

it('shows order tracking and return availability on a delivered order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for($user)->hasItems(1)->create(['status' => OrderStatus::Completed]);

    $this->actingAs($user)->get("/orders/{$order->id}")
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('shop/orders/show')
            ->has('tracking', 4)
            ->where('canReturn', true)
            ->has('returns', 0));
});

it('lets a customer submit a return for a delivered order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for($user)->create(['status' => OrderStatus::Completed]);

    $this->actingAs($user)->post("/orders/{$order->id}/return", [
        'reason' => 'The size was too small, I would like to exchange it.',
    ])->assertRedirect();

    $this->assertDatabaseHas('return_requests', [
        'order_id' => $order->id,
        'user_id' => $user->id,
        'status' => 'requested',
    ]);
});

it('rejects a return for an order that is not delivered', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for($user)->create(['status' => OrderStatus::Pending]);

    $this->actingAs($user)->post("/orders/{$order->id}/return", [
        'reason' => 'Changed my mind about this purchase entirely.',
    ])->assertSessionHasErrors('reason');

    $this->assertDatabaseCount('return_requests', 0);
});

it('forbids requesting a return on another users order', function () {
    $order = Order::factory()->for(User::factory())->create(['status' => OrderStatus::Completed]);

    $this->actingAs(User::factory()->create())->post("/orders/{$order->id}/return", [
        'reason' => 'This is not my order but let me try anyway please.',
    ])->assertForbidden();
});
