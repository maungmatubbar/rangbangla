<?php

namespace App\Http\Controllers\Shop;

use App\Actions\Addresses\RememberAddress;
use App\Actions\Orders\CreateOrder;
use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\CheckoutRequest;
use App\Support\Cart;
use App\Support\Otp\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function show(Request $request, Cart $cart): Response|RedirectResponse
    {
        if ($cart->isEmpty()) {
            return to_route('shop.products.index');
        }

        $user = $request->user();
        $default = $user->defaultAddress();

        return Inertia::render('shop/checkout', [
            'cart' => $cart->summary(),
            'defaultAddress' => $default,
            'contact' => [
                'name' => $default->name ?? $user->name,
                'phone' => $default->phone ?? $user->phone,
            ],
        ]);
    }

    /**
     * Send an OTP to the phone number to confirm the order.
     */
    public function sendOtp(Request $request, OtpService $otp): RedirectResponse
    {
        $data = $request->validate([
            'phone' => ['required', 'string', 'regex:/^01\d{9}$/'],
        ], [
            'phone.regex' => 'Enter a valid Bangladeshi number, e.g. 01712345678.',
        ]);

        $phone = OtpService::normalize($data['phone']);
        $code = $otp->send($phone, 'checkout');

        return back()->with('otp', [
            'sent' => true,
            'phone' => $phone,
            'debug' => $otp->shouldReveal() ? $code : null,
        ]);
    }

    public function store(CheckoutRequest $request, Cart $cart, CreateOrder $createOrder, RememberAddress $rememberAddress, OtpService $otp): RedirectResponse
    {
        if ($cart->isEmpty()) {
            return back()->withErrors(['cart' => 'Your cart is empty.']);
        }

        $phone = OtpService::normalize($request->validated('phone'));

        if (! $otp->verify($phone, $request->validated('otp'), 'checkout')) {
            throw ValidationException::withMessages([
                'otp' => 'The verification code is invalid or has expired.',
            ]);
        }

        $summary = $cart->summary();
        $coupon = $cart->coupon();
        $attributes = $request->orderAttributes();

        if ($coupon !== null && (int) $summary['discount'] > 0) {
            $attributes['discount'] = (int) $summary['discount'];
            $attributes['coupon_code'] = $coupon->code;
        }

        $order = $createOrder->handle(
            $request->user(),
            $cart->toOrderItems(),
            $attributes,
        );

        if ($coupon !== null && $order->discount > 0) {
            $coupon->increment('used_count');
        }

        // Remember the delivery address for faster future checkouts, skipping
        // it when the customer already has an identical address saved.
        $rememberAddress->handle($request->user(), $attributes);

        $cart->clear();

        Inertia::flash('toast', ['type' => 'success', 'message' => "Order {$order->order_number} placed."]);

        return to_route('shop.orders.show', $order);
    }
}
