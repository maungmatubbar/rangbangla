<?php

use App\Models\Product;
use App\Support\Money;

it('formats money as Bangladeshi Taka', function () {
    expect(Money::format(650000))->toBe('৳6,500');
    expect(Money::format(0))->toBe('৳0');
});

it('sums active variant stock as total stock', function () {
    $product = Product::factory()->create();
    $product->variants()->create(['size' => 'S', 'color' => 'Maroon', 'stock' => 5, 'is_active' => true]);
    $product->variants()->create(['size' => 'M', 'color' => 'Maroon', 'stock' => 7, 'is_active' => true]);
    $product->variants()->create(['size' => 'L', 'color' => 'Maroon', 'stock' => 3, 'is_active' => false]);

    expect($product->load('variants')->total_stock)->toBe(12);
});

it('builds a variant label from size and colour', function () {
    $product = Product::factory()->create();

    $sized = $product->variants()->create(['size' => 'M', 'color' => 'Maroon', 'stock' => 1, 'is_active' => true]);
    expect($sized->label)->toBe('M / Maroon');

    $free = $product->variants()->create(['size' => 'Free Size', 'color' => null, 'stock' => 1, 'is_active' => true]);
    expect($free->label)->toBe('Free Size');
});

it('reports on-sale state from the compare-at price', function () {
    $sale = Product::factory()->create(['price' => 100000, 'compare_at_price' => 150000]);
    $regular = Product::factory()->create(['price' => 100000, 'compare_at_price' => null]);

    expect($sale->on_sale)->toBeTrue();
    expect($regular->on_sale)->toBeFalse();
});
