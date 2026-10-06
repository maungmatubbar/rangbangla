<?php

namespace App\Actions\Orders;

use App\Enums\OrderStatus;
use App\Exceptions\InsufficientStockException;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CreateOrder
{
    /**
     * Create a pending order for the user from a list of variant line items.
     *
     * @param  array<int, array{variant_id: int|string, quantity: int|string}>  $items
     * @param  array<string, mixed>  $attributes  Optional order attributes (shipping, payment).
     *
     * @throws InsufficientStockException|ValidationException
     */
    public function handle(User $user, array $items, array $attributes = []): Order
    {
        return DB::transaction(function () use ($user, $items, $attributes): Order {
            $quantities = $this->consolidate($items);

            /** @var Collection<int, ProductVariant> $variants */
            $variants = ProductVariant::query()
                ->whereIn('id', array_keys($quantities))
                ->where('is_active', true)
                ->with('product')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $subtotal = 0;
            $lines = [];

            foreach ($quantities as $variantId => $quantity) {
                $variant = $variants->get($variantId);

                if ($variant === null || $variant->product === null || ! $variant->product->is_active) {
                    throw ValidationException::withMessages([
                        'items' => "A selected item is no longer available for purchase.",
                    ]);
                }

                if ($variant->stock < $quantity) {
                    throw InsufficientStockException::for(
                        $variant->product->name.' ('.$variant->label.')',
                        $quantity,
                        $variant->stock,
                    );
                }

                $unitPrice = $variant->effective_price;
                $lineTotal = $unitPrice * $quantity;
                $subtotal += $lineTotal;

                $lines[] = [
                    'product_id' => $variant->product_id,
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product->name,
                    'variant_label' => $variant->label,
                    'variant_size' => $variant->size,
                    'variant_color' => $variant->color,
                    'unit_price' => $unitPrice,
                    'quantity' => $quantity,
                    'line_total' => $lineTotal,
                ];
            }

            // An order-level discount (e.g. a coupon) is clamped to the
            // server-computed subtotal so the total can never go negative.
            $discount = max(0, min((int) ($attributes['discount'] ?? 0), $subtotal));

            /** @var Order $order */
            $order = $user->orders()->create([
                ...$attributes,
                'order_number' => $this->generateOrderNumber(),
                'status' => OrderStatus::Pending,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $subtotal - $discount,
            ]);

            $order->items()->createMany($lines);

            foreach ($lines as $line) {
                $variants->get($line['product_variant_id'])?->decrement('stock', $line['quantity']);
            }

            return $order->load('items');
        });
    }

    /**
     * Merge duplicate variant lines into a single quantity per variant id.
     *
     * @param  array<int, array{variant_id: int|string, quantity: int|string}>  $items
     * @return array<int, int>
     */
    private function consolidate(array $items): array
    {
        $quantities = [];

        foreach ($items as $item) {
            $variantId = (int) $item['variant_id'];
            $quantities[$variantId] = ($quantities[$variantId] ?? 0) + (int) $item['quantity'];
        }

        return $quantities;
    }

    private function generateOrderNumber(): string
    {
        return 'ORD-'.now()->format('Ymd').'-'.Str::upper(Str::random(6));
    }
}
