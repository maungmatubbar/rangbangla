<?php

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia;

it('lets guests browse the shop', function () {
    $this->get('/shop')->assertOk();
});

it('renders the product listing with images as a plain array', function () {
    $product = purchasableProduct();
    $product->images()->create(['path' => 'products/sample.svg', 'is_primary' => true, 'position' => 0]);

    $this->get('/shop')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('shop/products/index')
            ->has('categories')
            ->has('sizes')
            ->has('colors')
            ->has('products.data', 1)
            ->has('products.data.0.images', 1)
            ->has('products.data.0.variants', 1)
            ->where('products.data.0.images.0.url', fn (string $url) => str_contains($url, 'sample.svg')));
});

it('renders a product detail page with variants', function () {
    $product = purchasableProduct();

    $this->get("/shop/products/{$product->id}")
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('shop/products/show')
            ->where('product.id', $product->id)
            ->has('product.variants', 1)
            ->has('related'));
});

it('adds a variant to the cart as a guest', function () {
    $product = purchasableProduct();
    $variant = $product->variants->first();

    $this->post('/cart', ['product_variant_id' => $variant->id, 'quantity' => 2])
        ->assertRedirect()
        ->assertSessionHas('cart', [$variant->id => 2]);
});

it('renders the cart from the session', function () {
    $product = purchasableProduct();
    $variant = $product->variants->first();

    $this->withSession(['cart' => [$variant->id => 2]])
        ->get('/cart')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('shop/cart')
            ->where('cart.count', 2));
});

it('requires authentication to checkout', function () {
    $product = purchasableProduct();
    $variant = $product->variants->first();

    $this->withSession(['cart' => [$variant->id => 2]])
        ->get('/checkout')
        ->assertRedirect('/login');
});

it('checks out the cart into an order after otp verification', function () {
    $user = User::factory()->create();
    $product = purchasableProduct(['price' => 150000], ['stock' => 10]);
    $variant = $product->variants->first();

    $this->actingAs($user);

    // Request the checkout OTP.
    $this->post('/checkout/otp', ['phone' => '01700000000'])->assertRedirect();
    $code = Cache::get('otp:checkout:01700000000');
    expect($code)->not->toBeNull();

    // Place the order with the verified code.
    $this->withSession(['cart' => [$variant->id => 2]])
        ->post('/checkout', [
            'customer_name' => 'Ayesha Rahman',
            'phone' => '01700000000',
            'address' => '12 Gulshan Ave',
            'city' => 'Dhaka',
            'district' => 'Dhaka',
            'payment_method' => 'cod',
            'otp' => $code,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'total' => 300000,
        'payment_method' => 'cod',
        'customer_name' => 'Ayesha Rahman',
    ]);
    $this->assertDatabaseHas('order_items', [
        'product_variant_id' => $variant->id,
        'variant_label' => 'M / Maroon',
    ]);
    expect($variant->fresh()->stock)->toBe(8);
});

it('saves the checkout delivery address to the address book', function () {
    $user = User::factory()->create();
    $product = purchasableProduct(['price' => 150000], ['stock' => 10]);
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
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('addresses', [
        'user_id' => $user->id,
        'name' => 'Ayesha Rahman',
        'address' => '12 Gulshan Ave',
        'city' => 'Dhaka',
        'is_default' => true,
    ]);
    expect($user->addresses()->count())->toBe(1);
});

it('does not duplicate an address that is already saved', function () {
    $user = User::factory()->create();
    $user->addresses()->create([
        'name' => 'Ayesha Rahman',
        'phone' => '01700000000',
        'address' => '12 Gulshan Ave',
        'city' => 'Dhaka',
        'district' => 'Dhaka',
        'is_default' => true,
    ]);

    $product = purchasableProduct(['price' => 150000], ['stock' => 10]);
    $variant = $product->variants->first();

    $this->actingAs($user);
    $this->post('/checkout/otp', ['phone' => '01700000000'])->assertRedirect();
    $code = Cache::get('otp:checkout:01700000000');

    // Same address, only differing by case / surrounding whitespace.
    $this->withSession(['cart' => [$variant->id => 1]])
        ->post('/checkout', [
            'customer_name' => '  ayesha rahman  ',
            'phone' => '01700000000',
            'address' => '12 Gulshan Ave',
            'city' => 'Dhaka',
            'district' => 'Dhaka',
            'payment_method' => 'cod',
            'otp' => $code,
        ])
        ->assertRedirect();

    expect($user->addresses()->count())->toBe(1);
});

it('rejects checkout with an invalid otp', function () {
    $user = User::factory()->create();
    $product = purchasableProduct(['price' => 150000], ['stock' => 10]);
    $variant = $product->variants->first();

    $this->actingAs($user)
        ->withSession(['cart' => [$variant->id => 2]])
        ->post('/checkout', [
            'customer_name' => 'Ayesha Rahman',
            'phone' => '01700000000',
            'address' => '12 Gulshan Ave',
            'city' => 'Dhaka',
            'district' => 'Dhaka',
            'payment_method' => 'cod',
            'otp' => '000000',
        ])
        ->assertSessionHasErrors('otp');

    $this->assertDatabaseCount('orders', 0);
    expect($variant->fresh()->stock)->toBe(10);
});

it('completes an order from the storefront', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for($user)->create();

    $this->actingAs($user)->post("/orders/{$order->id}/complete")->assertRedirect();

    expect($order->fresh()->status->value)->toBe('completed');
});

it('forbids completing another users order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for(User::factory())->create();

    $this->actingAs($user)->post("/orders/{$order->id}/complete")->assertForbidden();
});
