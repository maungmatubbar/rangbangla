<?php

namespace App\Support;

use App\Models\Coupon;
use App\Models\ProductVariant;

/**
 * A lightweight session-backed shopping cart (variantId => quantity).
 */
class Cart
{
    private const KEY = 'cart';

    private const COUPON_KEY = 'cart_coupon';

    /**
     * @return array<int, int>
     */
    public function items(): array
    {
        /** @var array<int, int> $items */
        $items = session()->get(self::KEY, []);

        return $items;
    }

    public function add(int $variantId, int $quantity = 1): void
    {
        $items = $this->items();
        $items[$variantId] = ($items[$variantId] ?? 0) + $quantity;
        $this->persist($items);
    }

    public function set(int $variantId, int $quantity): void
    {
        $items = $this->items();

        if ($quantity <= 0) {
            unset($items[$variantId]);
        } else {
            $items[$variantId] = $quantity;
        }

        $this->persist($items);
    }

    public function remove(int $variantId): void
    {
        $items = $this->items();
        unset($items[$variantId]);
        $this->persist($items);
    }

    public function clear(): void
    {
        session()->forget(self::KEY);
        session()->forget(self::COUPON_KEY);
    }

    /**
     * The coupon code currently applied to the cart, if any.
     */
    public function couponCode(): ?string
    {
        $code = session()->get(self::COUPON_KEY);

        return is_string($code) ? $code : null;
    }

    public function applyCoupon(string $code): void
    {
        session()->put(self::COUPON_KEY, mb_strtoupper(trim($code)));
    }

    public function removeCoupon(): void
    {
        session()->forget(self::COUPON_KEY);
    }

    /**
     * Resolve the applied coupon model, or null if none/unknown.
     */
    public function coupon(): ?Coupon
    {
        $code = $this->couponCode();

        return $code !== null ? Coupon::findByCode($code) : null;
    }

    public function isEmpty(): bool
    {
        return $this->items() === [];
    }

    public function count(): int
    {
        return array_sum($this->items());
    }

    /**
     * Detailed cart contents with product/variant data and totals, for display.
     *
     * @return array<string, mixed>
     */
    public function summary(): array
    {
        $items = $this->items();

        if ($items === []) {
            return $this->totals([], 0, 0);
        }

        $variants = ProductVariant::query()
            ->whereIn('id', array_keys($items))
            ->with(['product.images'])
            ->get()
            ->keyBy('id');

        $lines = [];
        $subtotal = 0;
        $count = 0;

        foreach ($items as $variantId => $quantity) {
            $variant = $variants->get($variantId);

            if ($variant === null || ! $variant->is_active || $variant->product === null || ! $variant->product->is_active) {
                continue;
            }

            $unitPrice = $variant->effective_price;
            $originalUnitPrice = $variant->original_price;
            $lineTotal = $unitPrice * $quantity;
            $subtotal += $lineTotal;
            $count += $quantity;

            $lines[] = [
                'variant_id' => $variant->id,
                'product_id' => $variant->product_id,
                'name' => $variant->product->name,
                'slug' => $variant->product->slug,
                'variant_label' => $variant->label,
                'size' => $variant->size,
                'color' => $variant->color,
                'color_hex' => $variant->color_hex,
                'image' => $variant->product->primaryImage()?->url,
                'unit_price' => $unitPrice,
                'formatted_unit_price' => Money::format($unitPrice),
                'original_unit_price' => $originalUnitPrice,
                'formatted_original_unit_price' => Money::format($originalUnitPrice),
                'on_sale' => $originalUnitPrice > $unitPrice,
                'quantity' => $quantity,
                'stock' => $variant->stock,
                'line_total' => $lineTotal,
                'formatted_line_total' => Money::format($lineTotal),
            ];
        }

        return $this->totals($lines, $subtotal, $count);
    }

    /**
     * Assemble the totals block, resolving and validating any applied coupon.
     * An invalid or expired coupon is silently dropped from the session.
     *
     * @param  list<array<string, mixed>>  $lines
     * @return array<string, mixed>
     */
    private function totals(array $lines, int $subtotal, int $count): array
    {
        $discount = 0;
        $couponData = null;
        $coupon = $this->coupon();

        if ($coupon !== null && $subtotal > 0) {
            $reason = $coupon->reasonUnusableFor($subtotal);

            if ($reason === null) {
                $discount = $coupon->discountFor($subtotal);
                $couponData = [
                    'code' => $coupon->code,
                    'label' => $coupon->label(),
                    'discount' => $discount,
                    'formatted_discount' => Money::format($discount),
                ];
            } else {
                // Drop a coupon that is no longer valid for this cart.
                $this->removeCoupon();
            }
        }

        $total = max(0, $subtotal - $discount);

        return [
            'lines' => $lines,
            'subtotal' => $subtotal,
            'formatted_subtotal' => Money::format($subtotal),
            'discount' => $discount,
            'formatted_discount' => Money::format($discount),
            'total' => $total,
            'formatted_total' => Money::format($total),
            'coupon' => $couponData,
            'count' => $count,
        ];
    }

    /**
     * @return array<int, array{variant_id: int, quantity: int}>
     */
    public function toOrderItems(): array
    {
        $lines = [];

        foreach ($this->items() as $variantId => $quantity) {
            $lines[] = ['variant_id' => $variantId, 'quantity' => $quantity];
        }

        return $lines;
    }

    /**
     * @param  array<int, int>  $items
     */
    private function persist(array $items): void
    {
        session()->put(self::KEY, $items);
    }
}
