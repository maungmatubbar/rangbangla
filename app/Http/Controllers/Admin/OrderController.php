<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $status = (string) $request->query('status', '');
        $payment = (string) $request->query('payment', '');
        $term = (string) $request->query('q', '');

        $orders = Order::query()
            ->with('user')
            ->when($status !== '', fn ($q) => $q->where('status', $status))
            ->when($payment !== '', fn ($q) => $q->where('payment_status', $payment))
            ->when($term !== '', fn ($q) => $q->where(fn ($qq) => $qq
                ->where('order_number', 'like', "%{$term}%")
                ->orWhere('customer_name', 'like', "%{$term}%")
                ->orWhere('phone', 'like', "%{$term}%")))
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Order $order): array => $this->summary($order));

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => [
                'status' => $status,
                'payment' => $payment,
                'q' => $term,
            ],
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['items', 'user', 'returnRequests']);

        return Inertia::render('admin/orders/show', [
            'order' => [
                ...$this->summary($order),
                'subtotal' => $order->formatted_subtotal,
                'discount' => $order->discount,
                'formatted_discount' => $order->formatted_discount,
                'coupon_code' => $order->coupon_code,
                'payment_method' => $order->payment_method,
                'tracking_number' => $order->tracking_number,
                'admin_note' => $order->admin_note,
                'shipping' => [
                    'name' => $order->customer_name,
                    'phone' => $order->phone,
                    'address' => $order->address,
                    'city' => $order->city,
                    'district' => $order->district,
                    'postcode' => $order->postcode,
                    'note' => $order->shipping_note,
                ],
                'customer' => [
                    'id' => $order->user?->id,
                    'name' => $order->user?->name,
                    'email' => $order->user?->email,
                    'phone' => $order->user?->phone,
                ],
                'items' => $order->items->map(fn ($item): array => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'variant_label' => $item->variant_label,
                    'quantity' => $item->quantity,
                    'formatted_line_total' => $item->formatted_line_total,
                ])->values(),
                'returns' => $order->returnRequests->map(fn ($r): array => [
                    'id' => $r->id,
                    'status' => $r->status,
                    'reason' => $r->reason,
                ])->values(),
            ],
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:'.implode(',', OrderStatus::assignable())],
            'payment_status' => ['required', 'string', 'in:unpaid,paid'],
            'tracking_number' => ['nullable', 'string', 'max:64'],
            'admin_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $order->update([
            'status' => $data['status'],
            'payment_status' => $data['payment_status'],
            'tracking_number' => $data['tracking_number'] ?? null,
            'admin_note' => $data['admin_note'] ?? null,
            'paid_at' => $data['payment_status'] === 'paid' ? ($order->paid_at ?? now()) : null,
            'completed_at' => $data['status'] === OrderStatus::Completed->value ? ($order->completed_at ?? now()) : null,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Order updated.']);

        return back();
    }

    public function invoice(Order $order): View
    {
        return view('admin.invoice', [
            'order' => $order->load(['items', 'user']),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'customer' => $order->customer_name ?? $order->user?->name,
            'status' => $order->status->value,
            'status_label' => $order->status->label(),
            'payment_status' => $order->payment_status,
            'formatted_total' => $order->formatted_total,
            'items_count' => $order->items()->count(),
            'created_at' => $order->created_at,
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function statusOptions(): array
    {
        return array_map(
            fn (OrderStatus $status): array => ['value' => $status->value, 'label' => $status->label()],
            OrderStatus::cases(),
        );
    }
}
