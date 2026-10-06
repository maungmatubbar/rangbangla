<?php

namespace App\Http\Resources;

use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ProductVariant
 */
class ProductVariantResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'size' => $this->size,
            'color' => $this->color,
            'color_hex' => $this->color_hex,
            'label' => $this->label,
            'price' => $this->effective_price,
            'formatted_price' => $this->formatted_price,
            'stock' => $this->stock,
            'in_stock' => $this->stock > 0,
        ];
    }
}
