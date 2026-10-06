<?php

use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\OrderController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\Shop\ReturnRequestController;
use App\Http\Controllers\Shop\WishlistController;
use Illuminate\Support\Facades\Route;

// Public storefront: browsing and the cart are open to guests.
Route::get('shop', [ProductController::class, 'index'])->name('shop.products.index');
Route::get('shop/products/{product}', [ProductController::class, 'show'])->name('shop.products.show');

Route::get('cart', [CartController::class, 'show'])->name('shop.cart.show');
Route::post('cart', [CartController::class, 'store'])->name('shop.cart.store');
Route::patch('cart', [CartController::class, 'update'])->name('shop.cart.update');
Route::delete('cart', [CartController::class, 'destroy'])->name('shop.cart.destroy');
Route::post('cart/coupon', [CartController::class, 'applyCoupon'])->name('shop.cart.coupon.apply');
Route::delete('cart/coupon', [CartController::class, 'removeCoupon'])->name('shop.cart.coupon.remove');

// Checkout requires an authenticated account.
Route::middleware('auth')->group(function (): void {
    Route::get('checkout', [CheckoutController::class, 'show'])->name('shop.checkout.show');
    Route::post('checkout/otp', [CheckoutController::class, 'sendOtp'])
        ->middleware('throttle:6,1')
        ->name('shop.checkout.otp');
    Route::post('checkout', [CheckoutController::class, 'store'])->name('shop.checkout.store');
});

// Customer "My Account" area — orders and wishlist. Admins are redirected to
// their own dashboard so the two panels stay separate.
Route::middleware(['auth', 'customer'])->group(function (): void {
    Route::get('wishlist', [WishlistController::class, 'index'])->name('shop.wishlist.index');
    Route::post('wishlist', [WishlistController::class, 'store'])->name('shop.wishlist.store');
    Route::delete('wishlist/{product}', [WishlistController::class, 'destroy'])->name('shop.wishlist.destroy');

    Route::get('orders', [OrderController::class, 'index'])->name('shop.orders.index');
    Route::get('orders/{order}', [OrderController::class, 'show'])
        ->can('view', 'order')
        ->name('shop.orders.show');
    Route::post('orders/{order}/complete', [OrderController::class, 'complete'])
        ->can('complete', 'order')
        ->name('shop.orders.complete');
    Route::post('orders/{order}/return', [ReturnRequestController::class, 'store'])
        ->name('shop.orders.return');
});
