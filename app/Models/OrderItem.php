<?php

namespace App\Models;

use App\Support\Money;
use Database\Factories\OrderItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $order_id
 * @property int $product_id
 * @property int|null $product_variant_id
 * @property string $product_name
 * @property string|null $variant_label
 * @property string|null $variant_size
 * @property string|null $variant_color
 * @property int $unit_price
 * @property int $quantity
 * @property int $line_total
 */
#[Fillable([
    'order_id',
    'product_id',
    'product_variant_id',
    'product_name',
    'variant_label',
    'variant_size',
    'variant_color',
    'unit_price',
    'quantity',
    'line_total',
])]
class OrderItem extends Model
{
    /** @use HasFactory<OrderItemFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'product_variant_id' => 'integer',
            'unit_price' => 'integer',
            'quantity' => 'integer',
            'line_total' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return BelongsTo<ProductVariant, $this>
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /**
     * Human-readable line total, e.g. "৳2,500".
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function formattedLineTotal(): Attribute
    {
        return Attribute::get(fn (): string => Money::format($this->line_total));
    }
}
