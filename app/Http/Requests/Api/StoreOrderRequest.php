<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }

    /**
     * The validated line items, keyed the way CreateOrder expects.
     *
     * @return array<int, array{variant_id: int, quantity: int}>
     */
    public function items(): array
    {
        return array_map(
            fn (array $item): array => [
                'variant_id' => (int) $item['product_variant_id'],
                'quantity' => (int) $item['quantity'],
            ],
            $this->validated('items'),
        );
    }
}
