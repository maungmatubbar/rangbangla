<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function overview(Request $request): Response
    {
        $user = $request->user();

        $recentOrders = $user->orders()
            ->withCount('items')
            ->latest()
            ->limit(3)
            ->get()
            ->map(fn (Order $order): array => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'formatted_total' => $order->formatted_total,
                'items_count' => $order->items_count,
                'created_at' => $order->created_at,
            ]);

        return Inertia::render('account/overview', [
            'stats' => [
                'orders' => $user->orders()->count(),
                'wishlist' => $user->wishlist()->count(),
                'addresses' => $user->addresses()->count(),
            ],
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}
