<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductVariantController extends Controller
{
    public function store(Request $request, Product $product): RedirectResponse
    {
        $data = $this->validated($request);

        $exists = $product->variants()
            ->where('size', $data['size'])
            ->where('color', $data['color'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['size' => 'This size and colour combination already exists.']);
        }

        $product->variants()->create([
            ...$data,
            'sku' => $product->sku.'-'.Str::upper(Str::random(4)),
            'position' => (int) ($product->variants()->max('position') ?? -1) + 1,
        ]);

        $this->syncStock($product);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Variant added.']);

        return back();
    }

    public function update(Request $request, Product $product, ProductVariant $variant): RedirectResponse
    {
        abort_unless($variant->product_id === $product->id, 404);

        $variant->update($this->validated($request));
        $this->syncStock($product);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Variant updated.']);

        return back();
    }

    public function destroy(Product $product, ProductVariant $variant): RedirectResponse
    {
        abort_unless($variant->product_id === $product->id, 404);

        $variant->delete();
        $this->syncStock($product);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Variant removed.']);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'size' => ['nullable', 'string', 'max:40'],
            'color' => ['nullable', 'string', 'max:40'],
            'color_hex' => ['nullable', 'string', 'max:7'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $data['price'] = ($data['price'] ?? null) !== null
            ? (int) round(((float) $data['price']) * 100)
            : null;
        $data['is_active'] = $data['is_active'] ?? true;

        return $data;
    }

    private function syncStock(Product $product): void
    {
        $product->update([
            'stock' => (int) $product->variants()->where('is_active', true)->sum('stock'),
        ]);
    }
}
