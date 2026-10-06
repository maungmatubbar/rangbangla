import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronDown,
    Heart,
    ImageOff,
    RotateCcw,
    ShieldCheck,
    ShoppingCart,
    Truck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ColorSwatch } from '@/components/storefront/color-swatch';
import { PriceDisplay } from '@/components/storefront/price-display';
import { ProductCarousel } from '@/components/storefront/product-carousel';
import { QuantityStepper } from '@/components/storefront/quantity-stepper';
import { RatingStars } from '@/components/storefront/rating-stars';
import { SectionHeading } from '@/components/storefront/section-heading';
import { SizeSelector } from '@/components/storefront/size-selector';
import { cn } from '@/lib/utils';
import {
    discountPercent,
    fallbackGradient,
    toImageList,
    toggleWishlist,
} from '@/lib/shop';
import shop from '@/routes/shop';
import type { Product, ProductVariant } from '@/types';

type Props = {
    product: Product;
    related: Product[];
};

export default function ProductShow({ product, related }: Props) {
    const gallery = toImageList(product.images);
    const variants = product.variants ?? [];
    const sizes = product.sizes ?? [];
    const colors = product.colors ?? [];
    const discount = discountPercent(product);

    const [active, setActive] = useState(
        gallery.find((image) => image.is_primary)?.url ??
            gallery[0]?.url ??
            null,
    );

    const defaultVariant = variants.find((v) => v.in_stock) ?? variants[0];
    const [size, setSize] = useState<string | null>(
        defaultVariant?.size ?? null,
    );
    const [color, setColor] = useState<string | null>(
        defaultVariant?.color ?? null,
    );
    const [quantity, setQuantity] = useState(1);

    const selectedVariant: ProductVariant | undefined = useMemo(
        () =>
            variants.find(
                (v) =>
                    (v.size ?? null) === (size ?? null) &&
                    (v.color ?? null) === (color ?? null),
            ),
        [variants, size, color],
    );

    const disabledSizes = useMemo(
        () =>
            sizes.filter(
                (s) =>
                    !variants.some(
                        (v) =>
                            v.size === s &&
                            (color ? v.color === color : true) &&
                            v.in_stock,
                    ),
            ),
        [sizes, variants, color],
    );

    const stock = selectedVariant?.stock ?? 0;
    const canAdd = !!selectedVariant && selectedVariant.in_stock;

    const addToCart = () => {
        if (!selectedVariant) return;
        router.post(
            shop.cart.store.url(),
            { product_variant_id: selectedVariant.id, quantity },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title={product.name} />
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 md:px-6">
                <Link
                    href={shop.products.index()}
                    className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                    ← Back to shop
                </Link>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Gallery */}
                    <div className="flex flex-col gap-3">
                        <div
                            className={cn(
                                'group flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-3xl border bg-gradient-to-br',
                                fallbackGradient(product.slug),
                            )}
                        >
                            {active ? (
                                <img
                                    src={active}
                                    alt={product.name}
                                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <ImageOff className="size-10 text-muted-foreground/60" />
                            )}
                        </div>
                        {gallery.length > 1 && (
                            <div className="flex gap-3">
                                {gallery.map((image) => (
                                    <button
                                        key={image.url}
                                        type="button"
                                        onClick={() => setActive(image.url)}
                                        className={cn(
                                            'size-20 overflow-hidden rounded-xl border transition-all',
                                            active === image.url
                                                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                                : 'opacity-70 hover:opacity-100',
                                        )}
                                    >
                                        <img
                                            src={image.url}
                                            alt=""
                                            className="size-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                {product.category && (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-full"
                                    >
                                        {product.category}
                                    </Badge>
                                )}
                                {discount !== null && (
                                    <Badge className="rounded-full">
                                        Save {discount}%
                                    </Badge>
                                )}
                            </div>
                            <h1 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                                {product.name}
                            </h1>
                            <RatingStars value={5} count={24} />
                            <PriceDisplay product={product} size="lg" />
                            {canAdd ? (
                                <span className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-lime-600 dark:text-lime-400">
                                    <span className="size-2 rounded-full bg-lime-500" />
                                    In stock
                                    {stock <= 8 ? ` — only ${stock} left` : ''}
                                </span>
                            ) : (
                                <Badge
                                    variant="destructive"
                                    className="w-fit rounded-full"
                                >
                                    {selectedVariant
                                        ? 'Out of stock'
                                        : 'Unavailable combination'}
                                </Badge>
                            )}
                        </div>

                        <Separator />

                        {/* Colour */}
                        {colors.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">
                                    Colour:{' '}
                                    <span className="text-muted-foreground">
                                        {color}
                                    </span>
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((c) => (
                                        <ColorSwatch
                                            key={c.color}
                                            color={c.color}
                                            hex={c.color_hex}
                                            selected={color === c.color}
                                            onClick={() => setColor(c.color)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size */}
                        {sizes.length > 0 &&
                            !(
                                sizes.length === 1 && sizes[0] === 'Free Size'
                            ) && (
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium">
                                        Size:{' '}
                                        <span className="text-muted-foreground">
                                            {size}
                                        </span>
                                    </span>
                                    <SizeSelector
                                        sizes={sizes}
                                        value={size}
                                        onChange={setSize}
                                        disabledSizes={disabledSizes}
                                    />
                                </div>
                            )}

                        {/* Quantity + actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            <QuantityStepper
                                value={quantity}
                                onChange={setQuantity}
                                min={1}
                                max={Math.max(1, stock)}
                            />
                            <Button
                                onClick={addToCart}
                                size="lg"
                                disabled={!canAdd}
                                className="flex-1 rounded-full"
                            >
                                <ShoppingCart className="size-4" />
                                Add to cart
                            </Button>
                            <Button
                                type="button"
                                onClick={() => toggleWishlist(product)}
                                size="lg"
                                variant="outline"
                                className="rounded-full"
                                aria-label="Add to wishlist"
                            >
                                <Heart
                                    className={cn(
                                        'size-4',
                                        product.wishlisted &&
                                            'fill-primary text-primary',
                                    )}
                                />
                            </Button>
                        </div>

                        {/* Trust */}
                        <div className="grid grid-cols-3 gap-3 rounded-2xl border bg-secondary/30 p-4 text-center text-xs text-muted-foreground">
                            <div className="flex flex-col items-center gap-1">
                                <Truck className="size-5 text-primary" />
                                Nationwide delivery
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <ShieldCheck className="size-5 text-primary" />
                                Cash on delivery
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <RotateCcw className="size-5 text-primary" />
                                7-day returns
                            </div>
                        </div>

                        {/* Details accordion */}
                        <div className="flex flex-col divide-y rounded-2xl border">
                            <AccordionRow title="Description" defaultOpen>
                                <p className="leading-relaxed text-muted-foreground">
                                    {product.description}
                                </p>
                            </AccordionRow>
                            <AccordionRow title="Fabric & Care">
                                <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                                    <li>Premium handloom fabric</li>
                                    <li>Dry clean recommended for silk</li>
                                    <li>Gentle hand wash for cotton</li>
                                    <li>Iron on low to medium heat</li>
                                </ul>
                            </AccordionRow>
                            <AccordionRow title="Delivery & Returns">
                                <p className="text-muted-foreground">
                                    Delivered in 2–5 business days across
                                    Bangladesh. Cash on delivery available. Easy
                                    7-day return on unworn items with tags.
                                </p>
                            </AccordionRow>
                            {product.sku && (
                                <AccordionRow title="Product details">
                                    <p className="text-muted-foreground">
                                        SKU: {product.sku}
                                    </p>
                                </AccordionRow>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related */}
                {related.length > 0 && (
                    <section className="flex flex-col gap-6 border-t pt-10">
                        <SectionHeading
                            eyebrow="You may also like"
                            title="Related products"
                        />
                        <ProductCarousel products={related} />
                    </section>
                )}
            </div>
        </>
    );
}

function AccordionRow({
    title,
    children,
    defaultOpen = false,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium"
                aria-expanded={open}
            >
                {title}
                <ChevronDown
                    className={cn(
                        'size-4 text-muted-foreground transition-transform',
                        open && 'rotate-180',
                    )}
                />
            </button>
            {open && <div className="px-4 pb-4 text-sm">{children}</div>}
        </div>
    );
}
