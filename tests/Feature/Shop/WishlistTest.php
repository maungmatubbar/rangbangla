<?php

use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

it('redirects guests to login from the wishlist', function () {
    $this->get('/wishlist')->assertRedirect('/login');
});

it('adds a product to the wishlist idempotently', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)->post('/wishlist', ['product_id' => $product->id])->assertRedirect();
    $this->actingAs($user)->post('/wishlist', ['product_id' => $product->id])->assertRedirect();

    expect($user->wishlist()->count())->toBe(1);
    $this->assertDatabaseHas('wishlists', ['user_id' => $user->id, 'product_id' => $product->id]);
});

it('lists wishlisted products', function () {
    $user = User::factory()->create();
    $product = Product::factory()->withVariants()->create();
    $user->wishlist()->create(['product_id' => $product->id]);

    $this->actingAs($user)->get('/wishlist')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('shop/wishlist')
            ->has('products', 1)
            ->where('products.0.id', $product->id)
            ->where('products.0.wishlisted', true));
});

it('removes a product from the wishlist', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $user->wishlist()->create(['product_id' => $product->id]);

    $this->actingAs($user)->delete("/wishlist/{$product->id}")->assertRedirect();

    expect($user->wishlist()->count())->toBe(0);
});

it('marks products as wishlisted on the listing for the owner', function () {
    $user = User::factory()->create();
    $product = Product::factory()->withVariants()->create();
    $user->wishlist()->create(['product_id' => $product->id]);

    $this->actingAs($user)->get('/shop')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('products.data.0.wishlisted', true));
});
