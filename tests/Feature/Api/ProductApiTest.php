<?php

use App\Models\Product;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('requires a token to list products', function () {
    Product::factory()->create();

    $this->getJson('/api/v1/products')->assertUnauthorized();
});

it('lists only active products', function () {
    Sanctum::actingAs(User::factory()->create());
    Product::factory()->count(3)->withVariants()->create();
    Product::factory()->inactive()->create();

    $this->getJson('/api/v1/products')
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonStructure([
            'data' => [['id', 'name', 'price', 'formatted_price', 'currency', 'stock', 'in_stock', 'sizes', 'colors', 'variants', 'images']],
            'meta' => ['total'],
        ]);
});

it('filters products by category and sale', function () {
    Sanctum::actingAs(User::factory()->create());
    Product::factory()->withVariants()->create(['category' => 'Saree']);
    Product::factory()->withVariants()->onSale()->create(['category' => 'Panjabi']);

    $this->getJson('/api/v1/products?category=Saree')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.category', 'Saree');
});

it('searches products by term', function () {
    Sanctum::actingAs(User::factory()->create());
    Product::factory()->create(['name' => 'Blue Widget']);
    Product::factory()->create(['name' => 'Red Gadget']);

    $this->getJson('/api/v1/products?q=widget')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Blue Widget');
});

it('shows a single product', function () {
    Sanctum::actingAs(User::factory()->create());
    $product = Product::factory()->create();

    $this->getJson("/api/v1/products/{$product->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $product->id);
});

it('returns 404 for an inactive product', function () {
    Sanctum::actingAs(User::factory()->create());
    $product = Product::factory()->inactive()->create();

    $this->getJson("/api/v1/products/{$product->id}")->assertNotFound();
});
