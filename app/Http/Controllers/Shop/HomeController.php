<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $featured = Product::query()
            ->active()
            ->where('is_featured', true)
            ->with(['images', 'variants'])
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn (Product $product): array => $this->toArray(new ProductResource($product)));

        $newArrivals = Product::query()
            ->active()
            ->with(['images', 'variants'])
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn (Product $product): array => $this->toArray(new ProductResource($product)));

        $categories = Product::query()
            ->active()
            ->whereNotNull('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values();

        return Inertia::render('welcome', [
            'featured' => $featured,
            'newArrivals' => $newArrivals,
            'categories' => $categories,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function toArray(ProductResource $resource): array
    {
        return json_decode((string) json_encode($resource), true);
    }
}
