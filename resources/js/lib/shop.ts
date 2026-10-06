import { router } from '@inertiajs/react';
import type { Product, ProductImage } from '@/types';
import shop from '@/routes/shop';

type MaybeImages =
    | ProductImage[]
    | { data?: ProductImage[] }
    | null
    | undefined;

/**
 * Normalise a product's images into a plain array, tolerating either a raw
 * array or a `{ data: [...] }` resource-collection shape.
 */
export function toImageList(images: MaybeImages): ProductImage[] {
    if (Array.isArray(images)) {
        return images;
    }

    if (images && Array.isArray(images.data)) {
        return images.data;
    }

    return [];
}

export function primaryImageUrl(
    product: Pick<Product, 'images'>,
): string | null {
    const list = toImageList(product.images as MaybeImages);

    return list.find((image) => image.is_primary)?.url ?? list[0]?.url ?? null;
}

/** Tailwind classes for an order-status pill. */
export function orderStatusPill(status: string): string {
    switch (status) {
        case 'completed':
            return 'bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20';
        case 'shipped':
            return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20';
        case 'processing':
            return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
        case 'cancelled':
            return 'bg-destructive/10 text-destructive border-destructive/20';
        default:
            return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
}

/** Deterministic festive gradient for products without an image, based on a seed. */
export function fallbackGradient(seed: string): string {
    const palettes = [
        'from-[#C6EE3A]/20 to-[#A3C738]/20',
        'from-[#1F2A1A]/12 to-[#3F5416]/12',
        'from-[#E8EFE0]/60 to-[#C6EE3A]/20',
        'from-[#8BBF1E]/18 to-[#1F2A1A]/12',
        'from-[#D9E8C2]/50 to-[#8BBF1E]/18',
        'from-[#1F2A1A]/12 to-[#6B8A2A]/15',
    ];

    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
    }

    return palettes[Math.abs(hash) % palettes.length];
}

/** Percentage saved when a product is on sale, e.g. 20 for "-20%". */
export function discountPercent(
    product: Pick<Product, 'price' | 'compare_at_price'>,
): number | null {
    if (
        !product.compare_at_price ||
        product.compare_at_price <= product.price
    ) {
        return null;
    }

    return Math.round(
        ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100,
    );
}

/** Add or remove a product from the authenticated user's wishlist. */
export function toggleWishlist(
    product: Pick<Product, 'id' | 'wishlisted'>,
): void {
    if (product.wishlisted) {
        router.delete(shop.wishlist.destroy.url(product.id), {
            preserveScroll: true,
            preserveState: true,
        });
    } else {
        router.post(
            shop.wishlist.store.url(),
            { product_id: product.id },
            { preserveScroll: true, preserveState: true },
        );
    }
}
