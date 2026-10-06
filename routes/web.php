<?php

use App\Http\Controllers\Account\AccountController;
use App\Http\Controllers\Account\AddressController;
use App\Http\Controllers\Auth\PhoneAuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Shop\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

// Public content pages.
Route::get('about', [PageController::class, 'about'])->name('about');
Route::get('privacy', [PageController::class, 'privacy'])->name('privacy');
Route::get('contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('contact', [ContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

// Customer account panel (admins are redirected to their own dashboard).
Route::middleware(['auth', 'customer'])->group(function (): void {
    Route::get('account', [AccountController::class, 'overview'])->name('account.overview');

    Route::get('account/addresses', [AddressController::class, 'index'])->name('account.addresses.index');
    Route::post('account/addresses', [AddressController::class, 'store'])->name('account.addresses.store');
    Route::put('account/addresses/{address}', [AddressController::class, 'update'])->name('account.addresses.update');
    Route::delete('account/addresses/{address}', [AddressController::class, 'destroy'])->name('account.addresses.destroy');
    Route::patch('account/addresses/{address}/default', [AddressController::class, 'setDefault'])->name('account.addresses.default');
});

// Phone-number login with OTP (dev delivery). Guests only.
Route::middleware('guest')->group(function (): void {
    Route::post('auth/phone/otp', [PhoneAuthController::class, 'sendOtp'])
        ->middleware('throttle:6,1')
        ->name('auth.phone.otp');
    Route::post('auth/phone/login', [PhoneAuthController::class, 'login'])
        ->middleware('throttle:6,1')
        ->name('auth.phone.login');
});

// Legacy dashboard entry: route users to the right panel.
Route::middleware('auth')->get('dashboard', function () {
    return request()->user()->isAdmin()
        ? redirect()->route('admin.dashboard')
        : redirect()->route('account.overview');
})->name('dashboard');

require __DIR__.'/admin.php';
require __DIR__.'/shop.php';
require __DIR__.'/settings.php';
