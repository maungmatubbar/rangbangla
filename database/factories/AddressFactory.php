<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
{
    protected $model = Address::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'label' => fake()->randomElement(['Home', 'Office', null]),
            'name' => fake()->name(),
            'phone' => '01'.fake()->numerify('#########'),
            'address' => fake()->streetAddress(),
            'city' => 'Dhaka',
            'district' => 'Dhaka',
            'postcode' => fake()->numerify('1###'),
            'is_default' => false,
        ];
    }

    public function default(): static
    {
        return $this->state(fn (): array => ['is_default' => true]);
    }
}
