<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('requires a token to create an order', function () {
    $this->postJson('/api/v1/orders', [])->assertUnauthorized();
});

it('creates an order and decrements variant stock', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);
    $a = purchasableProduct(['price' => 1000], ['stock' => 10]);
    $b = purchasableProduct(['price' => 500], ['stock' => 5]);
    $va = $a->variants->first();
    $vb = $b->variants->first();

    $this->postJson('/api/v1/orders', [
        'items' => [
            ['product_variant_id' => $va->id, 'quantity' => 2],
            ['product_variant_id' => $vb->id, 'quantity' => 1],
        ],
    ])
        ->assertCreated()
        ->assertJsonPath('data.status', 'pending')
        ->assertJsonPath('data.total', 2500)
        ->assertJsonCount(2, 'data.items');

    expect($va->fresh()->stock)->toBe(8);
    expect($vb->fresh()->stock)->toBe(4);
    $this->assertDatabaseHas('orders', ['user_id' => $user->id, 'total' => 2500]);
});

it('rejects an empty order', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->postJson('/api/v1/orders', ['items' => []])->assertStatus(422);
});

it('rejects an order that exceeds available stock', function () {
    Sanctum::actingAs(User::factory()->create());
    $product = purchasableProduct([], ['stock' => 1]);
    $variant = $product->variants->first();

    $this->postJson('/api/v1/orders', ['items' => [['product_variant_id' => $variant->id, 'quantity' => 5]]])
        ->assertStatus(422);

    expect($variant->fresh()->stock)->toBe(1);
});

it('rejects an unknown variant', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->postJson('/api/v1/orders', ['items' => [['product_variant_id' => 99999, 'quantity' => 1]]])
        ->assertStatus(422);
});

it('lets the owner view their order', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);
    $order = Order::factory()->for($user)->create();

    $this->getJson("/api/v1/orders/{$order->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $order->id);
});

it('forbids viewing another users order', function () {
    Sanctum::actingAs(User::factory()->create());
    $order = Order::factory()->for(User::factory())->create();

    $this->getJson("/api/v1/orders/{$order->id}")->assertForbidden();
});

it('completes a pending order', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);
    $order = Order::factory()->for($user)->create();

    $this->postJson("/api/v1/orders/{$order->id}/complete")
        ->assertOk()
        ->assertJsonPath('data.status', 'completed');

    expect($order->fresh()->completed_at)->not->toBeNull();
});

it('cannot complete an order twice', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);
    $order = Order::factory()->for($user)->completed()->create();

    $this->postJson("/api/v1/orders/{$order->id}/complete")->assertStatus(422);
});
