<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\Money;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    private const CATEGORIES = [
        'Saree', 'Salwar Kameez', 'Three-Piece', 'Kurti', 'Lehenga',
        'Panjabi', 'Kurta', 'Fatua', 'Kids Panjabi', 'Kids Frock', 'Accessories',
    ];

    public function index(Request $request): Response
    {
        $products = Product::query()
            ->search((string) $request->query('q', ''))
            ->with(['images', 'variants'])
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'formatted_price' => $product->formatted_price,
                'discount_percent' => $product->discount_percent,
                'stock' => $product->total_stock,
                'variants_count' => $product->variants->count(),
                'is_active' => $product->is_active,
                'image' => $product->primaryImage()?->url,
            ]);

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'filters' => ['q' => (string) $request->query('q', '')],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => null,
            'options' => $this->options(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['name']);
        $data['stock'] = 0;

        $product = Product::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product created. Add images and variants.']);

        return to_route('admin.products.edit', $product);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => $this->serialize($product->load(['images', 'variants'])),
            'options' => $this->options(),
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = $this->validated($request);
        $product->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product updated.']);

        return back();
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product deleted.']);

        return to_route('admin.products.index');
    }

    /**
     * Apply (or clear) a store-wide percentage discount across every product.
     */
    public function discountAll(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'discount_percent' => ['required', 'integer', 'min:0', 'max:90'],
            'only_active' => ['nullable', 'boolean'],
        ]);

        $percent = (int) $data['discount_percent'];

        $affected = Product::query()
            ->when($data['only_active'] ?? false, fn ($query) => $query->where('is_active', true))
            ->update(['discount_percent' => $percent]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $percent > 0
                ? "{$percent}% discount applied to {$affected} product(s)."
                : "Discount cleared on {$affected} product(s).",
        ]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'discount_percent' => ['nullable', 'integer', 'min:0', 'max:90'],
            'category' => ['required', 'string', 'max:120'],
            'sku' => ['nullable', 'string', 'max:64'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
        ]);

        $compareAt = $data['compare_at_price'] ?? null;

        $data['price'] = (int) round(((float) $data['price']) * 100);
        $data['compare_at_price'] = ($compareAt !== null && $compareAt !== '')
            ? (int) round(((float) $compareAt) * 100)
            : null;
        $data['discount_percent'] = (int) ($data['discount_percent'] ?? 0);
        $data['is_active'] = $data['is_active'] ?? true;
        $data['is_featured'] = $data['is_featured'] ?? false;

        return $data;
    }

    private function uniqueSlug(string $name): string
    {
        return Str::slug($name).'-'.Str::lower(Str::random(5));
    }

    /**
     * @return array<string, mixed>
     */
    private function options(): array
    {
        return [
            'categories' => self::CATEGORIES,
            'sizes' => ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
            'colors' => collect(\Database\Factories\ProductVariantFactory::COLORS)
                ->map(fn (string $hex, string $name): array => ['color' => $name, 'color_hex' => $hex])
                ->values(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => $product->price / 100,
            'formatted_price' => $product->formatted_price,
            'compare_at_price' => $product->compare_at_price !== null ? $product->compare_at_price / 100 : null,
            'discount_percent' => $product->discount_percent,
            'sale_price' => $product->sale_price / 100,
            'formatted_sale_price' => Money::format($product->sale_price),
            'category' => $product->category,
            'sku' => $product->sku,
            'is_active' => $product->is_active,
            'is_featured' => $product->is_featured,
            'total_stock' => $product->total_stock,
            'images' => $product->images->map(fn ($image): array => [
                'id' => $image->id,
                'url' => $image->url,
                'is_primary' => $image->is_primary,
                'position' => $image->position,
            ])->values(),
            'variants' => $product->variants->map(fn ($variant): array => [
                'id' => $variant->id,
                'size' => $variant->size,
                'color' => $variant->color,
                'color_hex' => $variant->color_hex,
                'sku' => $variant->sku,
                'price' => $variant->price !== null ? $variant->price / 100 : null,
                'formatted_price' => Money::format($variant->effective_price),
                'stock' => $variant->stock,
                'is_active' => $variant->is_active,
            ])->values(),
        ];
    }
}
