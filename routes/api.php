<?php

use App\Http\Controllers\Api\V1\Auth\ApiTokenController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    // Public: exchange credentials for a Sanctum token.
    Route::post('auth/token', [ApiTokenController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('api.auth.token');

    // Everything else requires a valid Sanctum token.
    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('products', [ProductController::class, 'index'])->name('api.products.index');
        Route::get('products/{product}', [ProductController::class, 'show'])->name('api.products.show');

        Route::post('orders', [OrderController::class, 'store'])->name('api.orders.store');
        Route::get('orders/{order}', [OrderController::class, 'show'])
            ->can('view', 'order')
            ->name('api.orders.show');
        Route::post('orders/{order}/complete', [OrderController::class, 'complete'])
            ->can('complete', 'order')
            ->name('api.orders.complete');
    });
});
