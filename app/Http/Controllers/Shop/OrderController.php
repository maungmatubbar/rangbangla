<?php

namespace App\Http\Controllers\Shop;

use App\Actions\Orders\CompleteOrder;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = $request->user()->orders()
            ->withCount('items')
            ->latest()
            ->paginate(10)
            ->through(fn (Order $order): array => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'formatted_total' => $order->formatted_total,
                'items_count' => $order->items_count,
                'created_at' => $order->created_at,
            ]);

        return Inertia::render('shop/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['items', 'returnRequests']);

        return Inertia::render('shop/orders/show', [
            'order' => json_decode((string) json_encode(new OrderResource($order)), true),
            'tracking' => array_map(
                fn (OrderStatus $status): array => ['value' => $status->value, 'label' => $status->label()],
                OrderStatus::trackingSteps(),
            ),
            'canReturn' => $order->status === OrderStatus::Completed
                && ! $order->returnRequests->whereIn('status', ['requested', 'approved'])->count(),
            'returns' => $order->returnRequests->map(fn ($r): array => [
                'id' => $r->id,
                'status' => $r->status,
                'status_label' => $r->status_label,
                'reason' => $r->reason,
                'admin_note' => $r->admin_note,
                'created_at' => $r->created_at,
            ])->values(),
        ]);
    }

    public function complete(Order $order, CompleteOrder $completeOrder): RedirectResponse
    {
        $completeOrder->handle($order);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Order marked as completed.']);

        return back();
    }
}
