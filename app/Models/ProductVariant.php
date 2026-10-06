<?php

namespace App\Models;

use App\Support\Money;
use Database\Factories\ProductVariantFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $product_id
 * @property string|null $sku
 * @property string|null $size
 * @property string|null $color
 * @property string|null $color_hex
 * @property int|null $price
 * @property int $stock
 * @property int $position
 * @property bool $is_active
 * @property-read Product $product
 */
#[Fillable(['product_id', 'sku', 'size', 'color', 'color_hex', 'price', 'stock', 'position', 'is_active'])]
class ProductVariant extends Model
{
    /** @use HasFactory<ProductVariantFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'stock' => 'integer',
            'position' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * The variant's list price before any discount: its own override, or the
     * parent product's base price.
     *
     * @return Attribute<int, never>
     */
    protected function originalPrice(): Attribute
    {
        return Attribute::get(fn (): int => $this->price ?? $this->product->price);
    }

    /**
     * The variant's effective (charged) price: its list price with the parent
     * product's percentage markdown applied. Used by the cart and order flow,
     * so a product discount is honoured everywhere automatically.
     *
     * @return Attribute<int, never>
     */
    protected function effectivePrice(): Attribute
    {
        return Attribute::get(function (): int {
            $base = $this->original_price;
            $percent = (int) ($this->product->discount_percent ?? 0);

            return $percent > 0
                ? (int) round($base * (100 - $percent) / 100)
                : $base;
        });
    }

    /**
     * @return Attribute<non-falsy-string, never>
     */
    protected function formattedPrice(): Attribute
    {
        return Attribute::get(fn (): string => Money::format($this->effective_price));
    }

    /**
     * A short human label, e.g. "M / Maroon", "Free Size" or "Default".
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function label(): Attribute
    {
        return Attribute::get(function (): string {
            $parts = array_filter([$this->size, $this->color]);

            return $parts === [] ? 'Default' : implode(' / ', $parts);
        });
    }

    /**
     * @param  Builder<ProductVariant>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }
}
