<?php

use App\Models\Product;
use App\Support\Cart;
use Inertia\Testing\AssertableInertia;

it('keeps two variants of the same product as distinct cart lines', function () {
    $product = Product::factory()->create(['price' => 100000]);
    $small = $product->variants()->create(['size' => 'S', 'color' => 'Maroon', 'stock' => 10, 'is_active' => true]);
    $large = $product->variants()->create(['size' => 'L', 'color' => 'Maroon', 'stock' => 10, 'is_active' => true]);

    $this->post('/cart', ['product_variant_id' => $small->id, 'quantity' => 1]);
    $this->post('/cart', ['product_variant_id' => $large->id, 'quantity' => 2]);

    $this->get('/cart')->assertInertia(fn (AssertableInertia $page) => $page
        ->component('shop/cart')
        ->has('cart.lines', 2)
        ->where('cart.count', 3));
});

it('updates and removes a cart line by variant', function () {
    $product = Product::factory()->create(['price' => 100000]);
    $variant = $product->variants()->create(['size' => 'M', 'color' => 'Gold', 'stock' => 10, 'is_active' => true]);

    $this->withSession(['cart' => [$variant->id => 2]])
        ->patch('/cart', ['product_variant_id' => $variant->id, 'quantity' => 5])
        ->assertRedirect();
    expect(app(Cart::class)->items())->toBe([$variant->id => 5]);

    $this->delete('/cart', ['product_variant_id' => $variant->id])->assertRedirect();
    expect(app(Cart::class)->isEmpty())->toBeTrue();
});

it('falls back to the product price when the variant has no override', function () {
    $product = Product::factory()->create(['price' => 250000]);
    $variant = $product->variants()->create(['size' => 'M', 'color' => 'Maroon', 'price' => null, 'stock' => 5, 'is_active' => true]);

    expect($variant->effective_price)->toBe(250000);

    $override = $product->variants()->create(['size' => 'L', 'color' => 'Maroon', 'price' => 300000, 'stock' => 5, 'is_active' => true]);
    expect($override->effective_price)->toBe(300000);
});
