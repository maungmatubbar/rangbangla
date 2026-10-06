<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ReturnRequest;
use App\Models\User;
use App\Support\Money;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $revenue = (int) Order::where('payment_status', 'paid')->sum('total');

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'revenue' => Money::format($revenue),
                'orders' => Order::count(),
                'pending' => Order::where('status', OrderStatus::Pending->value)->count(),
                'products' => Product::count(),
                'customers' => User::where('is_admin', false)->count(),
                'returns' => ReturnRequest::where('status', 'requested')->count(),
                'low_stock' => Product::query()->where('stock', '<', 10)->count(),
            ],
            'salesSeries' => $this->salesSeries(),
            'statusBreakdown' => $this->statusBreakdown(),
            'categoryBreakdown' => $this->categoryBreakdown(),
            'recentOrders' => $this->recentOrders(),
        ]);
    }

    /**
     * Daily orders + paid revenue for the last 14 days.
     *
     * @return list<array{label: string, orders: int, revenue: int}>
     */
    private function salesSeries(): array
    {
        $since = now()->subDays(13)->startOfDay();

        $byDay = Order::query()
            ->where('created_at', '>=', $since)
            ->selectRaw("DATE(created_at) as d, COUNT(*) as orders_count, SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END) as revenue")
            ->groupBy('d')
            ->get()
            ->keyBy('d');

        return collect(range(13, 0))->map(function (int $ago) use ($byDay): array {
            $date = now()->subDays($ago);
            $row = $byDay->get($date->format('Y-m-d'));

            return [
                'label' => $date->format('M j'),
                'orders' => (int) ($row->orders_count ?? 0),
                'revenue' => (int) round((($row->revenue ?? 0)) / 100),
            ];
        })->all();
    }

    /**
     * @return list<array{status: string, label: string, count: int}>
     */
    private function statusBreakdown(): array
    {
        $counts = Order::query()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return collect(OrderStatus::cases())
            ->map(fn (OrderStatus $status): array => [
                'status' => $status->value,
                'label' => $status->label(),
                'count' => (int) ($counts[$status->value] ?? 0),
            ])
            ->all();
    }

    /**
     * @return list<array{label: string, count: int}>
     */
    private function categoryBreakdown(): array
    {
        return Product::query()
            ->selectRaw('category, COUNT(*) as count')
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderByDesc('count')
            ->limit(6)
            ->get()
            ->map(fn ($row): array => ['label' => (string) $row->category, 'count' => (int) $row->count])
            ->all();
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function recentOrders(): Collection
    {
        return Order::query()
            ->with('user')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Order $order): array => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => $order->customer_name ?? $order->user?->name,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'payment_status' => $order->payment_status,
                'formatted_total' => $order->formatted_total,
                'created_at' => $order->created_at,
            ]);
    }
}
