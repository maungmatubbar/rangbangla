<?php

use App\Models\Coupon;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia;

it('computes percentage and fixed discounts with a cap', function () {
    $percent = Coupon::create(['code' => 'SAVE10', 'type' => 'percent', 'value' => 10]);
    expect($percent->discountFor(100000))->toBe(10000);

    $capped = Coupon::create(['code' => 'BIG50', 'type' => 'percent', 'value' => 50, 'max_discount' => 20000]);
    expect($capped->discountFor(100000))->toBe(20000);

    $fixed = Coupon::create(['code' => 'FLAT500', 'type' => 'fixed', 'value' => 50000]);
    expect($fixed->discountFor(100000))->toBe(50000)
        ->and($fixed->discountFor(30000))->toBe(30000); // never exceeds subtotal
});

it('reports why a coupon is unusable', function () {
    $minOrder = Coupon::create(['code' => 'MIN3K', 'type' => 'percent', 'value' => 10, 'min_order' => 300000]);
    expect($minOrder->isUsableFor(200000))->toBeFalse()
        ->and($minOrder->isUsableFor(300000))->toBeTrue();

    $expired = Coupon::create(['code' => 'OLD', 'type' => 'percent', 'value' => 10, 'expires_at' => now()->subDay()]);
    expect($expired->isUsableFor(100000))->toBeFalse();

    $maxed = Coupon::create(['code' => 'USEDUP', 'type' => 'percent', 'value' => 10, 'usage_limit' => 1, 'used_count' => 1]);
    expect($maxed->isUsableFor(100000))->toBeFalse();
});

it('applies and removes a coupon on the cart', function () {
    $product = purchasableProduct(['price' => 100000]);
    $variant = $product->variants->first();
    Coupon::create(['code' => 'WELCOME10', 'type' => 'percent', 'value' => 10]);

    $this->withSession(['cart' => [$variant->id => 1]])
        ->post('/cart/coupon', ['code' => 'welcome10'])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $this->withSession(['cart' => [$variant->id => 1], 'cart_coupon' => 'WELCOME10'])
        ->get('/cart')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('cart.subtotal', 100000)
            ->where('cart.discount', 10000)
            ->where('cart.total', 90000)
            ->where('cart.coupon.code', 'WELCOME10'));

    $this->withSession(['cart' => [$variant->id => 1], 'cart_coupon' => 'WELCOME10'])
        ->delete('/cart/coupon')
        ->assertRedirect();
});

it('rejects an unknown or unusable coupon code', function () {
    $product = purchasableProduct(['price' => 100000]);
    $variant = $product->variants->first();
    Coupon::create(['code' => 'MIN5K', 'type' => 'percent', 'value' => 10, 'min_order' => 500000]);

    $this->withSession(['cart' => [$variant->id => 1]])
        ->post('/cart/coupon', ['code' => 'NOPE'])
        ->assertSessionHasErrors('code');

    $this->withSession(['cart' => [$variant->id => 1]])
        ->post('/cart/coupon', ['code' => 'MIN5K'])
        ->assertSessionHasErrors('code');
});

it('records the coupon discount on the order and increments usage', function () {
    $user = User::factory()->create();
    $product = purchasableProduct(['price' => 100000], ['stock' => 10]);
    $variant = $product->variants->first();
    $coupon = Coupon::create(['code' => 'WELCOME10', 'type' => 'percent', 'value' => 10]);

    $this->actingAs($user);
    $this->post('/checkout/otp', ['phone' => '01700000000'])->assertRedirect();
    $code = Cache::get('otp:checkout:01700000000');

    $this->withSession(['cart' => [$variant->id => 2], 'cart_coupon' => 'WELCOME10'])
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
        'subtotal' => 200000,
        'discount' => 20000,
        'total' => 180000,
        'coupon_code' => 'WELCOME10',
    ]);

    expect($coupon->fresh()->used_count)->toBe(1);
});

it('lets an admin create and delete a coupon', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $this->actingAs($admin)
        ->post('/admin/coupons', [
            'code' => 'eid25',
            'type' => 'percent',
            'value' => 25,
            'min_order' => 2000,
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $coupon = Coupon::firstWhere('code', 'EID25');
    expect($coupon)->not->toBeNull()
        ->and($coupon->value)->toBe(25)
        ->and($coupon->min_order)->toBe(200000); // ৳2,000 stored as poisha

    $this->actingAs($admin)->delete("/admin/coupons/{$coupon->id}")->assertRedirect();
    expect(Coupon::find($coupon->id))->toBeNull();
});
