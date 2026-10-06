<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Support\Cart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function show(Cart $cart): Response
    {
        return Inertia::render('shop/cart', [
            'cart' => $cart->summary(),
        ]);
    }

    public function store(Request $request, Cart $cart): RedirectResponse
    {
        $data = $request->validate([
            'product_variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $cart->add((int) $data['product_variant_id'], (int) ($data['quantity'] ?? 1));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Added to cart.']);

        return back();
    }

    public function update(Request $request, Cart $cart): RedirectResponse
    {
        $data = $request->validate([
            'product_variant_id' => ['required', 'integer'],
            'quantity' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $cart->set((int) $data['product_variant_id'], (int) $data['quantity']);

        return back();
    }

    public function destroy(Request $request, Cart $cart): RedirectResponse
    {
        $data = $request->validate([
            'product_variant_id' => ['required', 'integer'],
        ]);

        $cart->remove((int) $data['product_variant_id']);

        return back();
    }

    public function applyCoupon(Request $request, Cart $cart): RedirectResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:40'],
        ]);

        if ($cart->isEmpty()) {
            return back()->withErrors(['code' => 'Your cart is empty.']);
        }

        $coupon = Coupon::findByCode($data['code']);

        if ($coupon === null) {
            return back()->withErrors(['code' => 'That coupon code is not valid.']);
        }

        $subtotal = (int) $cart->summary()['subtotal'];

        if ($reason = $coupon->reasonUnusableFor($subtotal)) {
            return back()->withErrors(['code' => $reason]);
        }

        $cart->applyCoupon($coupon->code);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Coupon {$coupon->code} applied — {$coupon->label()}.",
        ]);

        return back();
    }

    public function removeCoupon(Cart $cart): RedirectResponse
    {
        $cart->removeCoupon();

        Inertia::flash('toast', ['type' => 'info', 'message' => 'Coupon removed.']);

        return back();
    }
}
