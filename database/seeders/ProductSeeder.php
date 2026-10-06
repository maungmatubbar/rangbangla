<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Verified Unsplash photo ids per category, used to give products
     * realistic imagery out of the box.
     *
     * @var array<string, list<string>>
     */
    private const PHOTOS = [
        'Saree' => ['1679006831648-7c9ea12e5807', '1618901185975-d59f7091bcfe', '1727430228383-aa1fb59db8bf', '1617627143750-d86bc21e42bb', '1641699862936-be9f49b1c38d', '1610030469983-98e550d6193c', '1609748340041-f5d61e061ebc', '1610030469668-8e9f641aaf27', '1678705730064-a7ecbab4b3fb', '1610030469839-f909584b43f1'],
        'Salwar Kameez' => ['1628477116196-48afe0d209e0', '1622207691293-5cd80466dab3', '1587538018365-2a1f8b544c08', '1526392195523-1f40e4e78117'],
        'Three-Piece' => ['1706685481823-b8f1a1c11fca', '1612595391900-29390866733a', '1615573678157-69c7fce87d54', '1463335361701-e90f4c5045d0'],
        'Kurti' => ['1622207691293-5cd80466dab3', '1526392195523-1f40e4e78117', '1587538018365-2a1f8b544c08', '1628477116196-48afe0d209e0'],
        'Panjabi' => ['1727835523545-70ee992b5763', '1744551358303-46edae8b374b', '1622780432053-767528938f34', '1655288828238-21d86ec971c3', '1727835523550-18478cacefa2'],
        'Kurta' => ['1667665970124-2273c6ef3489', '1711044871601-301f9b0ecf91', '1701365676249-9d7ab5022dec', '1628250521470-28c1fc54616c', '1667665970118-f55705003914'],
        'Fatua' => ['1622780432053-767528938f34', '1655288828238-21d86ec971c3', '1628250521470-28c1fc54616c'],
        'Accessories' => ['1694036317129-5c1ba84ac121', '1694036317141-2a4f18c2067c', '1694036317280-250d7ecce698', '1694036317182-58bb7cec5bfa', '1694036317080-d7f7e751ff61'],
    ];

    private const FALLBACK_PHOTOS = ['1679006831648-7c9ea12e5807', '1727835523545-70ee992b5763'];

    /** Festive colour name => hex. */
    private const COLORS = [
        'Maroon' => '#7B1E3B',
        'Gold' => '#C99700',
        'Deep Red' => '#A01A2F',
        'Emerald' => '#046A38',
        'Royal Blue' => '#1E3A8A',
        'Mustard' => '#D4A017',
        'Magenta' => '#A21CAF',
        'Ivory' => '#F3E9D2',
        'Black' => '#1A1A1A',
        'Teal' => '#0E7C7B',
    ];

    private const STITCHED = ['S', 'M', 'L', 'XL', 'XXL'];

    private const FREE = ['Free Size'];

    /**
     * A curated Bengali ethnic catalogue. Prices are in poisha (1 BDT = 100).
     *
     * @var list<array{name: string, price: int, compare_at?: int, category: string, sizes: list<string>, colors: list<string>, featured?: bool, description: string}>
     */
    private array $catalog = [
        ['name' => 'Silk Jamdani Saree', 'price' => 650000, 'compare_at' => 820000, 'category' => 'Saree', 'sizes' => self::FREE, 'colors' => ['Maroon', 'Deep Red', 'Gold'], 'featured' => true, 'description' => 'Handwoven Jamdani silk saree with an intricate contrast zari border — a festive heirloom crafted by Bengal artisans.'],
        ['name' => 'Katan Banarasi Saree', 'price' => 780000, 'category' => 'Saree', 'sizes' => self::FREE, 'colors' => ['Royal Blue', 'Magenta', 'Emerald'], 'featured' => true, 'description' => 'Pure Katan silk Banarasi saree with dense gold motif work across the pallu, made for weddings and celebrations.'],
        ['name' => 'Half-Silk Tangail Saree', 'price' => 320000, 'category' => 'Saree', 'sizes' => self::FREE, 'colors' => ['Teal', 'Mustard', 'Ivory'], 'description' => 'Lightweight half-silk Tangail saree with a fine woven border, comfortable for day-long wear.'],
        ['name' => 'Cotton Tant Saree', 'price' => 180000, 'category' => 'Saree', 'sizes' => self::FREE, 'colors' => ['Ivory', 'Maroon', 'Emerald'], 'description' => 'Classic soft cotton Tant saree with a crisp contrast anchal — a Bengali everyday favourite.'],

        ['name' => 'Embroidered Georgette Three-Piece', 'price' => 420000, 'compare_at' => 520000, 'category' => 'Three-Piece', 'sizes' => self::STITCHED, 'colors' => ['Maroon', 'Royal Blue', 'Black'], 'featured' => true, 'description' => 'Flowing georgette three-piece with hand-embroidered neckline, matching dupatta and salwar.'],
        ['name' => 'Karchupi Unstitched Three-Piece', 'price' => 360000, 'category' => 'Three-Piece', 'sizes' => self::FREE, 'colors' => ['Magenta', 'Emerald', 'Gold'], 'description' => 'Unstitched three-piece set with delicate karchupi thread work — tailor it to your perfect fit.'],
        ['name' => 'Printed Lawn Salwar Kameez', 'price' => 240000, 'category' => 'Salwar Kameez', 'sizes' => self::STITCHED, 'colors' => ['Teal', 'Mustard', 'Ivory'], 'description' => 'Breathable printed lawn salwar kameez with a soft chiffon dupatta, ideal for warm weather.'],
        ['name' => 'Silk Anarkali Kameez', 'price' => 460000, 'category' => 'Salwar Kameez', 'sizes' => self::STITCHED, 'colors' => ['Maroon', 'Royal Blue', 'Emerald'], 'featured' => true, 'description' => 'Floor-sweeping silk Anarkali with a flared silhouette and gold-accented yoke.'],

        ['name' => 'Chikankari Cotton Kurti', 'price' => 160000, 'category' => 'Kurti', 'sizes' => self::STITCHED, 'colors' => ['Ivory', 'Teal', 'Magenta'], 'description' => 'Hand-done Chikankari embroidery on breathable cotton — an everyday elegant kurti.'],
        ['name' => 'Embroidered A-Line Kurti', 'price' => 190000, 'compare_at' => 240000, 'category' => 'Kurti', 'sizes' => self::STITCHED, 'colors' => ['Maroon', 'Mustard', 'Black'], 'description' => 'Flattering A-line kurti with a mirror-and-thread embroidered panel down the front.'],

        ['name' => 'Cotton Panjabi', 'price' => 180000, 'category' => 'Panjabi', 'sizes' => self::STITCHED, 'colors' => ['Ivory', 'Black', 'Emerald'], 'featured' => true, 'description' => 'Premium cotton Panjabi with a subtle self-weave and matching buttons — a timeless festive staple.'],
        ['name' => 'Silk Embroidered Panjabi', 'price' => 340000, 'compare_at' => 420000, 'category' => 'Panjabi', 'sizes' => self::STITCHED, 'colors' => ['Maroon', 'Royal Blue', 'Gold'], 'featured' => true, 'description' => 'Dupion silk Panjabi with tonal chest embroidery, cut for a sharp Eid silhouette.'],
        ['name' => 'Linen Kurta', 'price' => 210000, 'category' => 'Kurta', 'sizes' => self::STITCHED, 'colors' => ['Teal', 'Mustard', 'Ivory'], 'description' => 'Relaxed pure-linen kurta with a mandarin collar, easy to dress up or down.'],
        ['name' => 'Printed Short Fatua', 'price' => 95000, 'category' => 'Fatua', 'sizes' => self::STITCHED, 'colors' => ['Black', 'Emerald', 'Maroon'], 'description' => 'Casual short Fatua in soft printed cotton — effortless everyday comfort.'],

        ['name' => 'Silk Dupatta / Orna', 'price' => 85000, 'category' => 'Accessories', 'sizes' => self::FREE, 'colors' => ['Gold', 'Maroon', 'Royal Blue'], 'description' => 'Gold-bordered pure silk dupatta to finish any three-piece or kurti set.'],
        ['name' => 'Nagra Juti (Handcrafted)', 'price' => 130000, 'category' => 'Accessories', 'sizes' => self::STITCHED, 'colors' => ['Maroon', 'Gold', 'Emerald'], 'description' => 'Hand-embroidered leather nagra juti with a cushioned sole — the finishing festive touch.'],
    ];

    public function run(): void
    {
        foreach ($this->catalog as $index => $item) {
            $slug = Str::slug($item['name']);

            $product = Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $item['name'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'compare_at_price' => $item['compare_at'] ?? null,
                    'stock' => 0,
                    'category' => $item['category'],
                    'sku' => 'RB-'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                    'is_active' => true,
                    'is_featured' => $item['featured'] ?? false,
                ],
            );

            // Rebuild images idempotently using realistic category imagery.
            $product->images()->delete();
            foreach ($this->photosFor($item['category'], $index) as $position => $url) {
                $product->images()->create([
                    'path' => $url,
                    'is_primary' => $position === 0,
                    'position' => $position,
                ]);
            }

            // Rebuild variants idempotently (size × colour), then set total stock.
            $product->variants()->delete();
            $position = 0;
            $totalStock = 0;
            foreach ($item['sizes'] as $size) {
                foreach ($item['colors'] as $color) {
                    // Keep most variants in stock; occasionally mark a non-primary one sold out.
                    $stock = ($position > 0 && (($index * 3 + $position) % 13 === 5)) ? 0 : (10 + (($index + $position) % 8) * 5);
                    $totalStock += $stock;
                    $product->variants()->create([
                        'sku' => $product->sku.'-'.Str::upper(Str::substr($size, 0, 2)).Str::upper(Str::substr($color, 0, 2)),
                        'size' => $size,
                        'color' => $color,
                        'color_hex' => self::COLORS[$color] ?? null,
                        'price' => null,
                        'stock' => $stock,
                        'position' => $position,
                        'is_active' => true,
                    ]);
                    $position++;
                }
            }

            $product->update(['stock' => $totalStock]);
        }
    }

    /**
     * Two realistic image URLs for a product, chosen deterministically from
     * the category pool so re-seeding is stable.
     *
     * @return list<string>
     */
    private function photosFor(string $category, int $index): array
    {
        $pool = self::PHOTOS[$category] ?? self::FALLBACK_PHOTOS;
        $count = count($pool);

        $first = $pool[$index % $count];
        $second = $pool[($index + 1) % $count];

        return [$this->imageUrl($first), $this->imageUrl($second)];
    }

    private function imageUrl(string $photoId): string
    {
        return "https://images.unsplash.com/photo-{$photoId}?w=800&h=1000&fit=crop&crop=faces,center&q=80&auto=format";
    }
}
