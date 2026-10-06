<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function index(Request $request): Response
    {
        $products = $request->user()
            ->wishlistedProducts()
            ->with(['images', 'variants'])
            ->latest('wishlists.created_at')
            ->get()
            ->map(fn (Product $product): array => $this->toArray(
                new ProductResource($product->setAttribute('wishlisted', true))
            ));

        return Inertia::render('shop/wishlist', [
            'products' => $products,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        $request->user()->wishlist()->firstOrCreate([
            'product_id' => (int) $data['product_id'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Saved to your wishlist.']);

        return back();
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $request->user()->wishlist()->where('product_id', $product->id)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Removed from your wishlist.']);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function toArray(ProductResource $resource): array
    {
        return json_decode((string) json_encode($resource), true);
    }
}
