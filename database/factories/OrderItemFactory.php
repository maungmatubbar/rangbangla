<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $unitPrice = fake()->numberBetween(120000, 600000);
        $quantity = fake()->numberBetween(1, 5);
        $size = fake()->randomElement(['S', 'M', 'L', 'XL', 'XXL']);
        $color = fake()->randomElement(['Maroon', 'Gold', 'Emerald', 'Royal Blue', 'Black']);

        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'product_variant_id' => null,
            'product_name' => Str::title(fake()->word().' '.fake()->word()),
            'variant_label' => "{$size} / {$color}",
            'variant_size' => $size,
            'variant_color' => $color,
            'unit_price' => $unitPrice,
            'quantity' => $quantity,
            'line_total' => $unitPrice * $quantity,
        ];
    }
}
