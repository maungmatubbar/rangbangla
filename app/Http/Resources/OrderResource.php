<?php

namespace App\Http\Resources;

use App\Models\Order;
use App\Support\Money;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Order
 */
class OrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'subtotal' => $this->subtotal,
            'formatted_subtotal' => $this->formatted_subtotal,
            'discount' => $this->discount,
            'formatted_discount' => $this->formatted_discount,
            'coupon_code' => $this->coupon_code,
            'total' => $this->total,
            'formatted_total' => $this->formatted_total,
            'currency' => Money::CURRENCY,
            'payment_status' => $this->payment_status,
            'tracking_number' => $this->tracking_number,
            'customer_name' => $this->customer_name,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'district' => $this->district,
            'postcode' => $this->postcode,
            'payment_method' => $this->payment_method,
            'shipping_note' => $this->shipping_note,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'completed_at' => $this->completed_at,
            'created_at' => $this->created_at,
        ];
    }
}
