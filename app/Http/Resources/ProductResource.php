<?php

namespace App\Http\Resources;

use App\Models\Product;
use App\Support\Money;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->sale_price,
            'formatted_price' => $this->formatted_price,
            'compare_at_price' => $this->discount_percent > 0 ? $this->price : $this->compare_at_price,
            'formatted_compare_at_price' => $this->formatted_compare_at_price,
            'discount_percent' => $this->discount_percent,
            'on_sale' => $this->on_sale,
            'is_new' => $this->is_new,
            'currency' => Money::CURRENCY,
            'stock' => $this->when($this->relationLoaded('variants'), fn (): int => $this->total_stock, $this->stock),
            'in_stock' => $this->when(
                $this->relationLoaded('variants'),
                fn (): bool => $this->total_stock > 0,
                $this->stock > 0,
            ),
            'category' => $this->category,
            'sku' => $this->sku,
            'sizes' => $this->when($this->relationLoaded('variants'), fn (): array => $this->availableSizes()),
            'colors' => $this->when($this->relationLoaded('variants'), fn (): array => $this->availableColors()),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'wishlisted' => (bool) $this->getAttribute('wishlisted'),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at,
        ];
    }
}
