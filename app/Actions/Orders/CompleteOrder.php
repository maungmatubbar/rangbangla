<?php

namespace App\Actions\Orders;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Validation\ValidationException;

class CompleteOrder
{
    /**
     * Transition a pending order to completed.
     *
     * @throws ValidationException
     */
    public function handle(Order $order): Order
    {
        if ($order->status !== OrderStatus::Pending) {
            throw ValidationException::withMessages([
                'status' => "Only pending orders can be completed. This order is already {$order->status->value}.",
            ]);
        }

        $order->update([
            'status' => OrderStatus::Completed,
            'completed_at' => now(),
        ]);

        return $order;
    }
}
