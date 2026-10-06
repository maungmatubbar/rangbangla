<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->numberBetween(1000, 100000);

        return [
            'user_id' => User::factory(),
            'order_number' => 'ORD-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),
            'status' => OrderStatus::Pending,
            'subtotal' => $subtotal,
            'total' => $subtotal,
            'completed_at' => null,
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (): array => [
            'status' => OrderStatus::Completed,
            'completed_at' => now(),
        ]);
    }
}
