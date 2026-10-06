import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ImageOff,
    ShieldCheck,
    ShoppingBag,
    Tag,
    Trash2,
    Truck,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { QuantityStepper } from '@/components/storefront/quantity-stepper';
import shop from '@/routes/shop';
import type { CartSummary } from '@/types';

type Props = {
    cart: CartSummary;
};

export default function CartPage({ cart }: Props) {
    const couponForm = useForm({ code: '' });

    const applyCoupon = (event: React.FormEvent) => {
        event.preventDefault();
        couponForm.post('/cart/coupon', {
            preserveScroll: true,
            onSuccess: () => couponForm.reset(),
        });
    };

    const removeCoupon = () => {
        router.delete('/cart/coupon', { preserveScroll: true });
    };

    const setQuantity = (variantId: number, quantity: number) => {
        router.patch(
            shop.cart.update.url(),
            { product_variant_id: variantId, quantity },
            { preserveScroll: true },
        );
    };

    const remove = (variantId: number) => {
        router.delete(shop.cart.destroy.url(), {
            data: { product_variant_id: variantId },
            preserveScroll: true,
        });
    };

    if (cart.lines.length === 0) {
        return (
            <>
                <Head title="Cart" />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
                        <ShoppingBag className="size-7 text-primary" />
                    </div>
                    <div>
                        <p className="font-display text-2xl font-semibold">
                            Your cart is empty
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Discover our festive collection to get started.
                        </p>
                    </div>
                    <Button asChild size="lg" className="rounded-full">
                        <Link href={shop.products.index()}>
                            Browse the collection
                        </Link>
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Cart" />
            <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
                <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight">
                    Your cart
                </h1>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-3 lg:col-span-2">
                        {cart.lines.map((line) => (
                            <Card
                                key={line.variant_id}
                                className="rounded-2xl border-border/70 py-0"
                            >
                                <CardContent className="flex items-center gap-4 p-4">
                                    <Link
                                        href={shop.products.show(
                                            line.product_id,
                                        )}
                                        className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted"
                                    >
                                        {line.image ? (
                                            <img
                                                src={line.image}
                                                alt={line.name}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <ImageOff className="size-6 text-muted-foreground/60" />
                                        )}
                                    </Link>
                                    <div className="flex flex-1 flex-col gap-1">
                                        <Link
                                            href={shop.products.show(
                                                line.product_id,
                                            )}
                                            className="font-medium hover:text-primary"
                                        >
                                            {line.name}
                                        </Link>
                                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {line.color_hex && (
                                                <span
                                                    className="inline-block size-3 rounded-full border"
                                                    style={{
                                                        backgroundColor:
                                                            line.color_hex,
                                                    }}
                                                />
                                            )}
                                            {line.variant_label}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {line.formatted_unit_price} each
                                        </span>
                                        <div className="mt-1 flex items-center gap-2">
                                            <QuantityStepper
                                                size="sm"
                                                value={line.quantity}
                                                min={1}
                                                max={Math.max(1, line.stock)}
                                                onChange={(q) =>
                                                    setQuantity(
                                                        line.variant_id,
                                                        q,
                                                    )
                                                }
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-muted-foreground hover:text-destructive"
                                                onClick={() =>
                                                    remove(line.variant_id)
                                                }
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="font-semibold">
                                        {line.formatted_line_total}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="h-fit rounded-2xl border-border/70 lg:sticky lg:top-24">
                        <CardContent className="flex flex-col gap-4 p-6">
                            <h2 className="font-display text-xl font-semibold">
                                Order summary
                            </h2>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Subtotal ({cart.count} item
                                    {cart.count === 1 ? '' : 's'})
                                </span>
                                <span>{cart.formatted_subtotal}</span>
                            </div>

                            {/* Coupon */}
                            {cart.coupon ? (
                                <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
                                    <span className="flex items-center gap-2 font-medium text-primary">
                                        <Tag className="size-4" />
                                        {cart.coupon.code}
                                        <span className="font-normal text-muted-foreground">
                                            ({cart.coupon.label})
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={removeCoupon}
                                        aria-label="Remove coupon"
                                        className="text-muted-foreground transition-colors hover:text-destructive"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={applyCoupon}
                                    className="flex flex-col gap-1.5"
                                >
                                    <div className="flex gap-2">
                                        <Input
                                            value={couponForm.data.code}
                                            onChange={(e) =>
                                                couponForm.setData(
                                                    'code',
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                            placeholder="Coupon code"
                                            aria-label="Coupon code"
                                            className="h-9"
                                        />
                                        <Button
                                            type="submit"
                                            variant="secondary"
                                            className="h-9 shrink-0"
                                            disabled={
                                                couponForm.processing ||
                                                couponForm.data.code.trim() ===
                                                    ''
                                            }
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                    {couponForm.errors.code && (
                                        <p className="text-xs text-destructive">
                                            {couponForm.errors.code}
                                        </p>
                                    )}
                                </form>
                            )}

                            {cart.discount > 0 && (
                                <div className="flex items-center justify-between text-sm text-primary">
                                    <span>Discount</span>
                                    <span>−{cart.formatted_discount}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Shipping
                                </span>
                                <span className="text-lime-600 dark:text-lime-400">
                                    Calculated at checkout
                                </span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between text-base font-semibold">
                                <span>Total</span>
                                <span>{cart.formatted_total}</span>
                            </div>
                            <Button
                                asChild
                                size="lg"
                                className="w-full rounded-full"
                            >
                                <Link href={shop.checkout.show.url()}>
                                    Proceed to checkout
                                </Link>
                            </Button>
                            <div className="flex flex-col gap-2 pt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-2">
                                    <Truck className="size-4 text-primary" />
                                    Free delivery over ৳3,000
                                </span>
                                <span className="flex items-center gap-2">
                                    <ShieldCheck className="size-4 text-primary" />
                                    Cash on delivery available
                                </span>
                            </div>
                            <Button variant="ghost" asChild className="w-full">
                                <Link href={shop.products.index()}>
                                    Continue shopping
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
