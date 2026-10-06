<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Shipped = 'shipped';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Processing => 'Processing',
            self::Shipped => 'Shipped',
            self::Completed => 'Delivered',
            self::Cancelled => 'Cancelled',
        };
    }

    /**
     * The ordered fulfilment steps used for customer order tracking.
     *
     * @return list<self>
     */
    public static function trackingSteps(): array
    {
        return [self::Pending, self::Processing, self::Shipped, self::Completed];
    }

    /**
     * Statuses an admin may transition an order to.
     *
     * @return list<string>
     */
    public static function assignable(): array
    {
        return array_map(fn (self $status): string => $status->value, self::cases());
    }
}
