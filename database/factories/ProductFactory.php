<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $garment = fake()->randomElement([
            'Silk Saree', 'Jamdani Saree', 'Cotton Panjabi', 'Embroidered Kurti',
            'Salwar Kameez', 'Three-Piece', 'Katan Saree', 'Linen Kurta',
        ]);
        $name = $garment.' '.Str::title(fake()->unique()->word());

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(5)),
            'description' => fake()->paragraph(),
            'price' => fake()->numberBetween(120000, 800000), // poisha (৳1,200–৳8,000)
            'compare_at_price' => null,
            'stock' => fake()->numberBetween(0, 200),
            'category' => fake()->randomElement([
                'Saree', 'Salwar Kameez', 'Three-Piece', 'Kurti',
                'Panjabi', 'Kurta', 'Fatua', 'Accessories',
            ]),
            'sku' => Str::upper(Str::random(3)).'-'.fake()->unique()->numerify('#####'),
            'is_active' => true,
            'is_featured' => false,
        ];
    }

    public function outOfStock(): static
    {
        return $this->state(fn (): array => ['stock' => 0]);
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => ['is_active' => false]);
    }

    public function featured(): static
    {
        return $this->state(fn (): array => ['is_featured' => true]);
    }

    public function onSale(): static
    {
        return $this->state(fn (array $attributes): array => [
            'compare_at_price' => (int) round(($attributes['price'] ?? 200000) * 1.3),
        ]);
    }

    /**
     * Attach purchasable variants (distinct sizes) to the product.
     */
    public function withVariants(int $count = 3): static
    {
        $sizes = array_slice(['S', 'M', 'L', 'XL', 'XXL'], 0, max(1, min($count, 5)));

        return $this->has(
            ProductVariant::factory()
                ->count(count($sizes))
                ->state(new Sequence(
                    ...array_map(fn (string $size): array => ['size' => $size, 'stock' => 25], $sizes),
                )),
            'variants',
        );
    }
}
