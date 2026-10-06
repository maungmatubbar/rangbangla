<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductImageController extends Controller
{
    public function store(Request $request, Product $product): RedirectResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:4096'],
        ]);

        $path = $request->file('image')->store('products/uploads', 'public');

        $position = (int) ($product->images()->max('position') ?? -1) + 1;

        $product->images()->create([
            'path' => $path,
            'is_primary' => $product->images()->count() === 0,
            'position' => $position,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Image uploaded.']);

        return back();
    }

    public function setPrimary(Product $product, ProductImage $image): RedirectResponse
    {
        abort_unless($image->product_id === $product->id, 404);

        $product->images()->update(['is_primary' => false]);
        $image->update(['is_primary' => true]);

        return back();
    }

    public function destroy(Product $product, ProductImage $image): RedirectResponse
    {
        abort_unless($image->product_id === $product->id, 404);

        // Remove the file only if it is a locally-stored upload.
        if (! str_starts_with($image->path, 'http')) {
            Storage::disk('public')->delete($image->path);
        }

        $wasPrimary = $image->is_primary;
        $image->delete();

        if ($wasPrimary && ($next = $product->images()->orderBy('position')->first())) {
            $next->update(['is_primary' => true]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Image removed.']);

        return back();
    }
}
