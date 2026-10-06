<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * search_products — GET /api/v1/products?q={query}
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min(50, max(1, (int) $request->integer('per_page', 15)));

        $products = Product::query()
            ->active()
            ->search($request->query('q'))
            ->inCategory((string) $request->query('category', ''))
            ->hasSize((string) $request->query('size', ''))
            ->hasColor((string) $request->query('color', ''))
            ->priceBetween($this->toMinor($request->query('min')), $this->toMinor($request->query('max')))
            ->sort((string) $request->query('sort', 'name'))
            ->with(['images', 'variants'])
            ->paginate($perPage)
            ->withQueryString();

        return ProductResource::collection($products);
    }

    /**
     * get_product — GET /api/v1/products/{product}
     */
    public function show(Product $product): ProductResource
    {
        abort_unless($product->is_active, 404);

        return ProductResource::make($product->load(['images', 'variants']));
    }

    private function toMinor(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) round(((float) $value) * 100);
    }
}
