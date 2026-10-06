import { Link, router } from '@inertiajs/react';
import { Check, Heart, ImageOff, ShoppingBag } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/storefront/price-display';
import { cn } from '@/lib/utils';
import {
    discountPercent,
    fallbackGradient,
    toImageList,
    toggleWishlist,
} from '@/lib/shop';
import shop from '@/routes/shop';
import type { Product } from '@/types';

type Props = {
    product: Product;
    className?: string;
};

export function ProductCard({ product, className }: Props) {
    const images = toImageList(product.images);
    const primary =
        images.find((image) => image.is_primary)?.url ?? images[0]?.url ?? null;
    const secondary =
        images.find((image) => image.url !== primary)?.url ?? null;
    const discount = discountPercent(product);
    const [liked, setLiked] = useState(Boolean(product.wishlisted));
    const [pop, setPop] = useState(false);
    const [added, setAdded] = useState(false);
    const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const firstAvailableVariant = product.variants?.find((v) => v.in_stock);

    const quickAdd = () => {
        if (!firstAvailableVariant) return;
        router.post(
            shop.cart.store.url(),
            { product_variant_id: firstAvailableVariant.id, quantity: 1 },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setAdded(true);
                    if (addedTimer.current) clearTimeout(addedTimer.current);
                    addedTimer.current = setTimeout(
                        () => setAdded(false),
                        1800,
                    );
                },
            },
        );
    };

    const onLike = () => {
        setLiked((v) => !v);
        setPop(true);
        toggleWishlist(product);
    };

    return (
        <div
            className={cn(
                'group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl hover:shadow-foreground/5',
                className,
            )}
        >
            <Link
                href={shop.products.show(product.id)}
                className="relative block overflow-hidden"
            >
                <div
                    className={cn(
                        'relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-gradient-to-br',
                        fallbackGradient(product.slug),
                    )}
                >
                    {primary ? (
                        <>
                            <img
                                src={primary}
                                alt={product.name}
                                loading="lazy"
                                className={cn(
                                    'size-full object-cover transition-all duration-700 ease-out group-hover:scale-105',
                                    secondary && 'group-hover:opacity-0',
                                )}
                            />
                            {secondary && (
                                <img
                                    src={secondary}
                                    alt=""
                                    aria-hidden
                                    loading="lazy"
                                    className="absolute inset-0 size-full scale-105 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-100"
                                />
                            )}
                        </>
                    ) : (
                        <ImageOff className="size-8 text-muted-foreground/60" />
                    )}
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {!product.in_stock && (
                        <span className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                            Sold out
                        </span>
                    )}
                    {product.in_stock && discount !== null && (
                        <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                            -{discount}%
                        </span>
                    )}
                    {product.in_stock &&
                        product.is_new &&
                        discount === null && (
                            <span className="bg-lime text-lime-ink rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm">
                                New
                            </span>
                        )}
                </div>
            </Link>

            {/* Wishlist */}
            <button
                type="button"
                onClick={onLike}
                onAnimationEnd={() => setPop(false)}
                aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                className="absolute top-2.5 right-2.5 inline-flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
            >
                <Heart
                    className={cn(
                        'size-4 transition-colors',
                        liked && 'fill-red-500 text-red-500',
                        pop && 'animate-heart-pop',
                    )}
                />
            </button>

            <div className="flex flex-1 flex-col gap-1.5 p-4">
                {product.category && (
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {product.category}
                    </span>
                )}
                <Link
                    href={shop.products.show(product.id)}
                    className="line-clamp-1 leading-tight font-medium transition-colors hover:text-primary"
                >
                    {product.name}
                </Link>
                <div className="mt-auto flex items-center justify-between pt-3">
                    <PriceDisplay product={product} size="md" />
                    <Button
                        size="icon"
                        variant={added ? 'default' : 'secondary'}
                        className={cn(
                            'rounded-full border transition-all active:scale-90',
                            added ? 'border-primary' : 'border-border/60',
                        )}
                        disabled={!product.in_stock}
                        onClick={quickAdd}
                        aria-label={
                            added
                                ? `${product.name} added to cart`
                                : `Add ${product.name} to cart`
                        }
                    >
                        {added ? (
                            <Check className="animate-badge-pop size-4" />
                        ) : (
                            <ShoppingBag className="size-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
