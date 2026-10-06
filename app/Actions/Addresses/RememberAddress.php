<?php

namespace App\Actions\Addresses;

use App\Models\Address;
use App\Models\User;

class RememberAddress
{
    /**
     * Save the shipping address used at checkout to the user's address book,
     * unless an identical address is already saved (no duplicates).
     *
     * @param  array<string, mixed>  $attributes  Checkout/order attributes.
     */
    public function handle(User $user, array $attributes): Address
    {
        $fields = [
            'name' => $this->clean($attributes['customer_name'] ?? ''),
            'phone' => $this->clean($attributes['phone'] ?? ''),
            'address' => $this->clean($attributes['address'] ?? ''),
            'city' => $this->clean($attributes['city'] ?? ''),
            'district' => $this->clean($attributes['district'] ?? ''),
            'postcode' => $this->cleanNullable($attributes['postcode'] ?? null),
        ];

        $existing = $user->addresses()->get()->first(
            fn (Address $address): bool => $this->matches($address, $fields),
        );

        if ($existing !== null) {
            return $existing;
        }

        return $user->addresses()->create([
            ...$fields,
            // The very first saved address becomes the default.
            'is_default' => $user->addresses()->count() === 0,
        ]);
    }

    /**
     * Whether a saved address is the same delivery address (ignoring case
     * and surrounding whitespace) as the given checkout fields.
     *
     * @param  array<string, string|null>  $fields
     */
    private function matches(Address $address, array $fields): bool
    {
        foreach (['name', 'phone', 'address', 'city', 'district', 'postcode'] as $key) {
            if ($this->key($address->{$key}) !== $this->key($fields[$key])) {
                return false;
            }
        }

        return true;
    }

    private function clean(mixed $value): string
    {
        return trim((string) $value);
    }

    private function cleanNullable(mixed $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    /** Normalise a field for comparison. */
    private function key(?string $value): string
    {
        return mb_strtolower(trim((string) $value));
    }
}
