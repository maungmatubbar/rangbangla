<?php

namespace App\Models;

use App\Support\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $code
 * @property string $type
 * @property int $value
 * @property int|null $min_order
 * @property int|null $max_discount
 * @property int|null $usage_limit
 * @property int $used_count
 * @property Carbon|null $expires_at
 * @property bool $is_active
 */
#[Fillable([
    'code',
    'type',
    'value',
    'min_order',
    'max_discount',
    'usage_limit',
    'used_count',
    'expires_at',
    'is_active',
])]
class Coupon extends Model
{
    public const TYPE_PERCENT = 'percent';

    public const TYPE_FIXED = 'fixed';

    /**
     * In-memory defaults mirroring the schema, so a freshly built (not yet
     * reloaded) coupon validates correctly.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'type' => self::TYPE_PERCENT,
        'used_count' => 0,
        'is_active' => true,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'integer',
            'min_order' => 'integer',
            'max_discount' => 'integer',
            'usage_limit' => 'integer',
            'used_count' => 'integer',
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Look a coupon up by code, case-insensitively.
     */
    public static function findByCode(string $code): ?self
    {
        return self::query()->whereRaw('UPPER(code) = ?', [mb_strtoupper(trim($code))])->first();
    }

    /**
     * @param  Builder<Coupon>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /**
     * Why this coupon cannot be applied to the given subtotal, or null if it can.
     */
    public function reasonUnusableFor(int $subtotal): ?string
    {
        if (! $this->is_active) {
            return 'This coupon is no longer active.';
        }

        if ($this->expires_at !== null && $this->expires_at->isPast()) {
            return 'This coupon has expired.';
        }

        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return 'This coupon has reached its usage limit.';
        }

        if ($this->min_order !== null && $subtotal < $this->min_order) {
            return 'Spend at least '.Money::format($this->min_order).' to use this coupon.';
        }

        return null;
    }

    public function isUsableFor(int $subtotal): bool
    {
        return $this->reasonUnusableFor($subtotal) === null;
    }

    /**
     * The discount amount in poisha for the given subtotal.
     */
    public function discountFor(int $subtotal): int
    {
        if (! $this->isUsableFor($subtotal)) {
            return 0;
        }

        if ($this->type === self::TYPE_FIXED) {
            return min($this->value, $subtotal);
        }

        $discount = (int) round($subtotal * min($this->value, 100) / 100);

        if ($this->max_discount !== null) {
            $discount = min($discount, $this->max_discount);
        }

        return min($discount, $subtotal);
    }

    /**
     * Short human label, e.g. "20% off" or "৳500 off".
     */
    public function label(): string
    {
        return $this->type === self::TYPE_FIXED
            ? Money::format($this->value).' off'
            : $this->value.'% off';
    }
}
