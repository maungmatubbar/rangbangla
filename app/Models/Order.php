<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Support\Money;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $order_number
 * @property OrderStatus $status
 * @property int $subtotal
 * @property int $discount
 * @property string|null $coupon_code
 * @property int $total
 * @property string|null $customer_name
 * @property string|null $phone
 * @property string|null $address
 * @property string|null $city
 * @property string|null $district
 * @property string|null $postcode
 * @property string|null $payment_method
 * @property string $payment_status
 * @property Carbon|null $paid_at
 * @property string|null $tracking_number
 * @property string|null $admin_note
 * @property string|null $shipping_note
 * @property Carbon|null $completed_at
 */
#[Fillable([
    'user_id',
    'order_number',
    'status',
    'subtotal',
    'discount',
    'coupon_code',
    'total',
    'customer_name',
    'phone',
    'address',
    'city',
    'district',
    'postcode',
    'payment_method',
    'payment_status',
    'paid_at',
    'tracking_number',
    'admin_note',
    'shipping_note',
    'completed_at',
])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'subtotal' => 'integer',
            'discount' => 'integer',
            'total' => 'integer',
            'paid_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * @return HasMany<ReturnRequest, $this>
     */
    public function returnRequests(): HasMany
    {
        return $this->hasMany(ReturnRequest::class);
    }

    /**
     * @return Attribute<non-falsy-string, never>
     */
    protected function formattedSubtotal(): Attribute
    {
        return Attribute::get(fn (): string => Money::format($this->subtotal));
    }

    /**
     * @return Attribute<non-falsy-string, never>
     */
    protected function formattedDiscount(): Attribute
    {
        return Attribute::get(fn (): string => Money::format($this->discount));
    }

    /**
     * @return Attribute<non-falsy-string, never>
     */
    protected function formattedTotal(): Attribute
    {
        return Attribute::get(fn (): string => Money::format($this->total));
    }
}
