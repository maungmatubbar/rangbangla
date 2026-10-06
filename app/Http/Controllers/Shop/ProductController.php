<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'q' => (string) $request->query('q', ''),
            'category' => (string) $request->query('category', ''),
            'size' => (string) $request->query('size', ''),
            'color' => (string) $request->query('color', ''),
            'min' => $request->query('min'),
            'max' => $request->query('max'),
            'sort' => (string) $request->query('sort', 'name'),
            'sale' => $request->boolean('sale'),
        ];

        $wishlistedIds = $request->user()
            ? $request->user()->wishlist()->pluck('product_id')->all()
            : [];

        $products = Product::query()
            ->active()
            ->search($filters['q'])
            ->inCategory($filters['category'])
            ->hasSize($filters['size'])
            ->hasColor($filters['color'])
            ->priceBetween($this->toMinor($filters['min']), $this->toMinor($filters['max']))
            ->when($filters['sale'], fn ($query) => $query->onSale())
            ->sort($filters['sort'])
            ->with(['images', 'variants'])
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Product $product): array => $this->toArray(new ProductResource(
                $product->setAttribute('wishlisted', in_array($product->id, $wishlistedIds, true)),
            )));

        $categories = Product::query()
            ->active()
            ->whereNotNull('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values();

        $sizes = ProductVariant::query()
            ->where('is_active', true)
            ->whereNotNull('size')
            ->distinct()
            ->pluck('size')
            ->values();

        $colors = ProductVariant::query()
            ->where('is_active', true)
            ->whereNotNull('color')
            ->get(['color', 'color_hex'])
            ->unique('color')
            ->map(fn (ProductVariant $variant): array => [
                'color' => $variant->color,
                'color_hex' => $variant->color_hex,
            ])
            ->values();

        return Inertia::render('shop/products/index', [
            'products' => $products,
            'categories' => $categories,
            'sizes' => $sizes,
            'colors' => $colors,
            'filters' => $filters,
        ]);
    }

    public function show(Request $request, Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $userId = $request->user()?->id;

        $product->load(['images', 'variants']);

        if ($userId) {
            $product->setAttribute('wishlisted', $product->wishlistedBy()->whereKey($userId)->exists());
        }

        $related = Product::query()
            ->active()
            ->where('id', '!=', $product->id)
            ->when($product->category, fn (Builder $query) => $query->where('category', $product->category))
            ->with(['images', 'variants'])
            ->inRandomOrder()
            ->limit(4)
            ->get()
            ->map(fn (Product $item): array => $this->toArray(new ProductResource($item)));

        return Inertia::render('shop/products/show', [
            'product' => $this->toArray(new ProductResource($product)),
            'related' => $related,
        ]);
    }

    private function toMinor(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) round(((float) $value) * 100);
    }

    /**
     * Fully resolve an API resource (including nested resource collections) into
     * a plain array for Inertia props.
     *
     * @return array<string, mixed>
     */
    private function toArray(ProductResource $resource): array
    {
        return json_decode((string) json_encode($resource), true);
    }
}
