<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Support\Money;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $customers = User::query()
            ->where('is_admin', false)
            ->when($request->query('q'), fn ($q, $term) => $q->where(fn ($qq) => $qq
                ->where('name', 'like', "%{$term}%")
                ->orWhere('email', 'like', "%{$term}%")
                ->orWhere('phone', 'like', "%{$term}%")))
            ->withCount('orders')
            ->withSum(['orders as spent' => fn ($q) => $q->where('payment_status', 'paid')], 'total')
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'orders_count' => $user->orders_count,
                'spent' => Money::format((int) ($user->spent ?? 0)),
                'created_at' => $user->created_at,
            ]);

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
            'filters' => ['q' => (string) $request->query('q', '')],
        ]);
    }

    public function show(User $user): Response
    {
        abort_if($user->isAdmin(), 404);

        $orders = $user->orders()
            ->latest()
            ->get()
            ->map(fn (Order $order): array => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'payment_status' => $order->payment_status,
                'formatted_total' => $order->formatted_total,
                'paid_at' => $order->paid_at,
                'created_at' => $order->created_at,
            ]);

        return Inertia::render('admin/customers/show', [
            'customer' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'created_at' => $user->created_at,
            ],
            'stats' => [
                'orders' => $user->orders()->count(),
                'spent' => Money::format((int) $user->orders()->where('payment_status', 'paid')->sum('total')),
                'addresses' => $user->addresses()->count(),
            ],
            'orders' => $orders,
            'addresses' => $user->addresses()->get(),
        ]);
    }
}
