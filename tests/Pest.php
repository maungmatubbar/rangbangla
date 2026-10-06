<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

/**
 * Create a single-variant, purchasable product for storefront/checkout tests.
 *
 * @param  array<string, mixed>  $attributes
 * @param  array<string, mixed>  $variantAttributes
 */
function purchasableProduct(array $attributes = [], array $variantAttributes = []): \App\Models\Product
{
    $product = \App\Models\Product::factory()->create($attributes);

    $product->variants()->create(array_merge([
        'size' => 'M',
        'color' => 'Maroon',
        'color_hex' => '#7B1E3B',
        'price' => null,
        'stock' => 10,
        'position' => 0,
        'is_active' => true,
    ], $variantAttributes));

    return $product->load('variants');
}
