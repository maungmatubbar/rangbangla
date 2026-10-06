<?php

namespace App\Http\Requests\Shop;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
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
            'customer_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:120'],
            'district' => ['required', 'string', 'max:120'],
            'postcode' => ['nullable', 'string', 'max:16'],
            'payment_method' => ['required', 'string', 'in:cod'],
            'shipping_note' => ['nullable', 'string', 'max:1000'],
            'otp' => ['required', 'string', 'size:6'],
        ];
    }

    /**
     * The shipping / contact attributes to persist on the order.
     *
     * @return array<string, mixed>
     */
    public function orderAttributes(): array
    {
        return $this->only([
            'customer_name',
            'phone',
            'address',
            'city',
            'district',
            'postcode',
            'payment_method',
            'shipping_note',
        ]);
    }
}
