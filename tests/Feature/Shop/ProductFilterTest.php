<?php

use App\Models\Product;
use Inertia\Testing\AssertableInertia;

function productWithVariant(array $attributes, array $variant): Product
{
    $product = Product::factory()->create($attributes);
    $product->variants()->create(array_merge([
        'stock' => 10,
        'is_active' => true,
    ], $variant));

    return $product;
}

it('filters products by category', function () {
    productWithVariant(['category' => 'Saree'], ['size' => 'Free Size', 'color' => 'Maroon']);
    productWithVariant(['category' => 'Panjabi'], ['size' => 'M', 'color' => 'Ivory']);

    $this->get('/shop?category=Saree')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.category', 'Saree'));
});

it('filters products by size', function () {
    productWithVariant(['category' => 'Panjabi'], ['size' => 'M', 'color' => 'Ivory']);
    productWithVariant(['category' => 'Kurti'], ['size' => 'XL', 'color' => 'Maroon']);

    $this->get('/shop?size=XL')
        ->assertInertia(fn (AssertableInertia $page) => $page->has('products.data', 1));
});

it('filters products by colour', function () {
    productWithVariant(['category' => 'Saree'], ['size' => 'Free Size', 'color' => 'Emerald']);
    productWithVariant(['category' => 'Saree'], ['size' => 'Free Size', 'color' => 'Maroon']);

    $this->get('/shop?color=Emerald')
        ->assertInertia(fn (AssertableInertia $page) => $page->has('products.data', 1));
});

it('filters products by price range', function () {
    productWithVariant(['price' => 300000], ['size' => 'M', 'color' => 'Maroon']); // ৳3,000 (in range)
    productWithVariant(['price' => 900000], ['size' => 'M', 'color' => 'Gold']); // ৳9,000 (out of range)

    // Prices are entered in Taka in the UI and converted to poisha server-side.
    $this->get('/shop?min=2000&max=5000')
        ->assertInertia(fn (AssertableInertia $page) => $page->has('products.data', 1));
});

it('filters products on sale', function () {
    Product::factory()->withVariants()->create(['price' => 100000, 'compare_at_price' => null]);
    Product::factory()->withVariants()->create(['price' => 100000, 'compare_at_price' => 150000]);

    $this->get('/shop?sale=1')
        ->assertInertia(fn (AssertableInertia $page) => $page->has('products.data', 1));
});

it('sorts products by price ascending', function () {
    productWithVariant(['name' => 'Expensive', 'price' => 900000], ['size' => 'M', 'color' => 'Gold']);
    productWithVariant(['name' => 'Cheap', 'price' => 100000], ['size' => 'M', 'color' => 'Maroon']);

    $this->get('/shop?sort=price_asc')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('products.data.0.name', 'Cheap'));
});
