<?php

namespace App\Models;

use App\Support\Money;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property int $price
 * @property int|null $compare_at_price
 * @property int $discount_percent
 * @property int $stock
 * @property string|null $category
 * @property string|null $sku
 * @property bool $is_active
 * @property bool $is_featured
 */
#[Fillable(['name', 'slug', 'description', 'price', 'compare_at_price', 'discount_percent', 'stock', 'category', 'sku', 'is_active', 'is_featured'])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'compare_at_price' => 'integer',
            'discount_percent' => 'integer',
            'stock' => 'integer',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    /**
     * @return HasMany<ProductImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('position');
    }

    /**
     * @return HasMany<ProductVariant, $this>
     */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('position');
    }

    /**
     * Users who have wishlisted this product.
     *
     * @return BelongsToMany<User, $this>
     */
    public function wishlistedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'wishlists')->withTimestamps();
    }

    public function primaryImage(): ?ProductImage
    {
        return $this->images->firstWhere('is_primary', true) ?? $this->images->first();
    }

    /**
     * Total purchasable stock across active variants.
     *
     * @return Attribute<int, never>
     */
    protected function totalStock(): Attribute
    {
        return Attribute::get(fn (): int => $this->relationLoaded('variants')
            ? (int) $this->variants->where('is_active', true)->sum('stock')
            : (int) $this->variants()->where('is_active', true)->sum('stock'));
    }

    /**
     * Distinct sizes offered by active variants, in a stable order.
     *
     * @return list<string>
     */
    public function availableSizes(): array
    {
        $order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

        $sizes = $this->variants
            ->where('is_active', true)
            ->pluck('size')
            ->filter()
            ->unique()
            ->values()
            ->all();

        usort($sizes, function (string $a, string $b) use ($order): int {
            return array_search($a, $order, true) <=> array_search($b, $order, true);
        });

        return $sizes;
    }

    /**
     * Distinct colours offered by active variants.
     *
     * @return list<array{color: string, color_hex: string|null}>
     */
    public function availableColors(): array
    {
        return $this->variants
            ->where('is_active', true)
            ->filter(fn (ProductVariant $variant): bool => filled($variant->color))
            ->unique('color')
            ->map(fn (ProductVariant $variant): array => [
                'color' => $variant->color,
                'color_hex' => $variant->color_hex,
            ])
            ->values()
            ->all();
    }

    /**
     * Whether a store-managed percentage markdown is active.
     *
     * @return Attribute<bool, never>
     */
    protected function isDiscounted(): Attribute
    {
        return Attribute::get(fn (): bool => $this->discount_percent > 0);
    }

    /**
     * The effective selling price after any percentage markdown, in poisha.
     * This is the amount actually charged and displayed.
     *
     * @return Attribute<int, never>
     */
    protected function salePrice(): Attribute
    {
        return Attribute::get(fn (): int => $this->discount_percent > 0
            ? (int) round($this->price * (100 - $this->discount_percent) / 100)
            : $this->price);
    }

    /**
     * Human-readable selling price, e.g. "৳6,500".
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function formattedPrice(): Attribute
    {
        return Attribute::get(fn (): string => Money::format($this->sale_price));
    }

    /**
     * Human-readable strike-through price, when a product is on sale.
     * A percentage markdown strikes through the original price; otherwise the
     * manual compare-at price is used.
     *
     * @return Attribute<string|null, never>
     */
    protected function formattedCompareAtPrice(): Attribute
    {
        return Attribute::get(function (): ?string {
            if ($this->discount_percent > 0) {
                return Money::format($this->price);
            }

            return $this->compare_at_price !== null
                ? Money::format($this->compare_at_price)
                : null;
        });
    }

    /**
     * Whether the product is on sale (percentage markdown or compare-at price).
     *
     * @return Attribute<bool, never>
     */
    protected function onSale(): Attribute
    {
        return Attribute::get(fn (): bool => $this->discount_percent > 0
            || ($this->compare_at_price !== null && $this->compare_at_price > $this->price));
    }

    /**
     * Whether the product was created within the last two weeks.
     *
     * @return Attribute<bool, never>
     */
    protected function isNew(): Attribute
    {
        return Attribute::get(fn (): bool => $this->created_at !== null
            && $this->created_at->greaterThan(now()->subDays(14)));
    }

    /**
     * @param  Builder<Product>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /**
     * Filter products whose name, description or category match the term.
     *
     * @param  Builder<Product>  $query
     */
    public function scopeSearch(Builder $query, ?string $term): void
    {
        $term = trim((string) $term);

        if ($term === '') {
            return;
        }

        $query->where(function (Builder $q) use ($term): void {
            $q->where('name', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%")
                ->orWhere('category', 'like', "%{$term}%");
        });
    }

    /**
     * @param  Builder<Product>  $query
     */
    public function scopeInCategory(Builder $query, ?string $category): void
    {
        if (filled($category)) {
            $query->where('category', $category);
        }
    }

    /**
     * @param  Builder<Product>  $query
     */
    public function scopeHasSize(Builder $query, ?string $size): void
    {
        if (filled($size)) {
            $query->whereHas('variants', fn (Builder $q) => $q
                ->where('is_active', true)
                ->where('size', $size));
        }
    }

    /**
     * @param  Builder<Product>  $query
     */
    public function scopeHasColor(Builder $query, ?string $color): void
    {
        if (filled($color)) {
            $query->whereHas('variants', fn (Builder $q) => $q
                ->where('is_active', true)
                ->where('color', $color));
        }
    }

    /**
     * @param  Builder<Product>  $query
     */
    public function scopePriceBetween(Builder $query, ?int $minMinor, ?int $maxMinor): void
    {
        if ($minMinor !== null) {
            $query->where('price', '>=', $minMinor);
        }

        if ($maxMinor !== null) {
            $query->where('price', '<=', $maxMinor);
        }
    }

    /**
     * @param  Builder<Product>  $query
     */
    public function scopeOnSale(Builder $query, bool $onlySale = true): void
    {
        if ($onlySale) {
            $query->where(function (Builder $q): void {
                $q->where('discount_percent', '>', 0)
                    ->orWhere(fn (Builder $inner) => $inner
                        ->whereNotNull('compare_at_price')
                        ->whereColumn('compare_at_price', '>', 'price'));
            });
        }
    }

    /**
     * @param  Builder<Product>  $query
     */
    public function scopeSort(Builder $query, ?string $sort): void
    {
        match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'newest' => $query->latest(),
            default => $query->orderBy('name'),
        };
    }
}
