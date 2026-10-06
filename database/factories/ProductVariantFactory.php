<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    protected $model = ProductVariant::class;

    /** @var array<string, string> */
    public const COLORS = [
        'Maroon' => '#7B1E3B',
        'Gold' => '#C99700',
        'Deep Red' => '#A01A2F',
        'Emerald' => '#046A38',
        'Royal Blue' => '#1E3A8A',
        'Mustard' => '#D4A017',
        'Magenta' => '#A21CAF',
        'Ivory' => '#F3E9D2',
        'Black' => '#1A1A1A',
        'Teal' => '#0E7C7B',
    ];

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $color = fake()->randomElement(array_keys(self::COLORS));

        return [
            'product_id' => Product::factory(),
            'sku' => Str::upper(Str::random(3)).'-'.fake()->unique()->numerify('#####'),
            'size' => fake()->randomElement(['S', 'M', 'L', 'XL', 'XXL']),
            'color' => $color,
            'color_hex' => self::COLORS[$color],
            'price' => null,
            'stock' => fake()->numberBetween(0, 40),
            'position' => 0,
            'is_active' => true,
        ];
    }

    public function outOfStock(): static
    {
        return $this->state(fn (): array => ['stock' => 0]);
    }

    public function size(string $size): static
    {
        return $this->state(fn (): array => ['size' => $size]);
    }

    public function color(string $color, ?string $hex = null): static
    {
        return $this->state(fn (): array => [
            'color' => $color,
            'color_hex' => $hex ?? self::COLORS[$color] ?? null,
        ]);
    }
}
