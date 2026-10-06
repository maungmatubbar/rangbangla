<?php

use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia;

it('derives the sale price from the discount percentage', function () {
    $product = Product::factory()->create([
        'price' => 100000,
        'discount_percent' => 20,
    ]);

    expect($product->sale_price)->toBe(80000)
        ->and($product->is_discounted)->toBeTrue()
        ->and($product->on_sale)->toBeTrue()
        ->and($product->formatted_price)->toBe('৳800')
        ->and($product->formatted_compare_at_price)->toBe('৳1,000');
});

it('applies the product discount to the variant effective price', function () {
    $product = purchasableProduct(['price' => 200000, 'discount_percent' => 25]);
    $variant = $product->variants->first();

    expect($variant->original_price)->toBe(200000)
        ->and($variant->effective_price)->toBe(150000);
});

it('exposes the discounted price through the product listing', function () {
    purchasableProduct(['price' => 100000, 'discount_percent' => 10]);

    $this->get('/shop')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('products.data.0.price', 90000)
            ->where('products.data.0.compare_at_price', 100000)
            ->where('products.data.0.discount_percent', 10)
            ->where('products.data.0.on_sale', true));
});

it('includes percentage-discounted products in the sale filter', function () {
    purchasableProduct(['price' => 100000, 'discount_percent' => 15, 'name' => 'Discounted Saree']);
    purchasableProduct(['price' => 100000, 'discount_percent' => 0, 'name' => 'Full Price Kurti']);

    $this->get('/shop?sale=1')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->has('products.data', 1));
});

it('charges the discounted price at checkout', function () {
    $user = User::factory()->create();
    $product = purchasableProduct(['price' => 100000, 'discount_percent' => 20], ['stock' => 10]);
    $variant = $product->variants->first();

    $this->actingAs($user);
    $this->post('/checkout/otp', ['phone' => '01700000000'])->assertRedirect();
    $code = Cache::get('otp:checkout:01700000000');

    $this->withSession(['cart' => [$variant->id => 1]])
        ->post('/checkout', [
            'customer_name' => 'Ayesha Rahman',
            'phone' => '01700000000',
            'address' => '12 Gulshan Ave',
            'city' => 'Dhaka',
            'district' => 'Dhaka',
            'payment_method' => 'cod',
            'otp' => $code,
        ])->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'subtotal' => 80000,
        'total' => 80000,
    ]);
});

it('lets an admin apply a store-wide discount to all products', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    Product::factory()->count(3)->create(['discount_percent' => 0]);

    $this->actingAs($admin)
        ->post('/admin/products/discount-all', ['discount_percent' => 30, 'only_active' => false])
        ->assertRedirect();

    expect(Product::where('discount_percent', 30)->count())->toBe(3);

    // Clearing resets every product to zero.
    $this->actingAs($admin)
        ->post('/admin/products/discount-all', ['discount_percent' => 0, 'only_active' => false])
        ->assertRedirect();

    expect(Product::where('discount_percent', 0)->count())->toBe(3);
});
