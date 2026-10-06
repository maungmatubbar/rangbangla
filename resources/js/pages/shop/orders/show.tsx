import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, RotateCcw, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { orderStatusPill } from '@/lib/shop';
import shop from '@/routes/shop';
import type { Order, OrderReturn, TrackingStep } from '@/types';

type Props = {
    order: Order;
    tracking: TrackingStep[];
    canReturn: boolean;
    returns: OrderReturn[];
};

function money(minor: number): string {
    return `৳${Math.round(minor / 100).toLocaleString('en-US')}`;
}

export default function OrderShow({
    order,
    tracking,
    canReturn,
    returns,
}: Props) {
    const returnForm = useForm({ reason: '' });

    const submitReturn = (event: React.FormEvent) => {
        event.preventDefault();
        returnForm.post(shop.orders.return.url(order.id), {
            preserveScroll: true,
            onSuccess: () => returnForm.reset(),
        });
    };

    const currentIndex = tracking.findIndex((s) => s.value === order.status);
    const cancelled = order.status === 'cancelled';

    return (
        <>
            <Head title={order.order_number} />
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 md:px-6">
                <Link
                    href={shop.orders.index()}
                    className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                    <ArrowLeft className="size-4" /> Back to orders
                </Link>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="font-display text-2xl font-semibold tracking-tight">
                            {order.order_number}
                        </h1>
                        {order.created_at && (
                            <p className="text-sm text-muted-foreground">
                                Placed{' '}
                                {new Date(order.created_at).toLocaleString()}
                            </p>
                        )}
                    </div>
                    <span
                        className={cn(
                            'rounded-full border px-3 py-1 text-sm font-medium',
                            orderStatusPill(order.status),
                        )}
                    >
                        {order.status_label}
                    </span>
                </div>

                {/* Tracking */}
                <Card className="rounded-2xl">
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold">Order tracking</h2>
                            {order.tracking_number && (
                                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Truck className="size-4 text-primary" />
                                    {order.tracking_number}
                                </span>
                            )}
                        </div>

                        {cancelled ? (
                            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                This order was cancelled.
                            </p>
                        ) : (
                            <div className="flex items-center">
                                {tracking.map((step, index) => {
                                    const done = index <= currentIndex;
                                    return (
                                        <div
                                            key={step.value}
                                            className="flex flex-1 flex-col items-center"
                                        >
                                            <div className="flex w-full items-center">
                                                <div
                                                    className={cn(
                                                        'h-0.5 flex-1',
                                                        index === 0
                                                            ? 'bg-transparent'
                                                            : index <=
                                                                currentIndex
                                                              ? 'bg-primary'
                                                              : 'bg-border',
                                                    )}
                                                />
                                                <span
                                                    className={cn(
                                                        'flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs',
                                                        done
                                                            ? 'border-primary bg-primary text-primary-foreground'
                                                            : 'border-border bg-background text-muted-foreground',
                                                    )}
                                                >
                                                    {done ? (
                                                        <Check className="size-4" />
                                                    ) : (
                                                        index + 1
                                                    )}
                                                </span>
                                                <div
                                                    className={cn(
                                                        'h-0.5 flex-1',
                                                        index ===
                                                            tracking.length - 1
                                                            ? 'bg-transparent'
                                                            : index <
                                                                currentIndex
                                                              ? 'bg-primary'
                                                              : 'bg-border',
                                                    )}
                                                />
                                            </div>
                                            <span
                                                className={cn(
                                                    'mt-2 text-center text-xs',
                                                    done
                                                        ? 'font-medium text-foreground'
                                                        : 'text-muted-foreground',
                                                )}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Items */}
                <Card className="rounded-2xl">
                    <CardContent className="flex flex-col gap-4">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between gap-3"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {item.product_name}
                                    </span>
                                    {item.variant_label && (
                                        <span className="text-xs text-muted-foreground">
                                            {item.variant_label}
                                        </span>
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                        {item.quantity} ×{' '}
                                        {money(item.unit_price)}
                                    </span>
                                </div>
                                <span className="font-medium">
                                    {item.formatted_line_total}
                                </span>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Subtotal</span>
                            <span>{order.formatted_subtotal}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex items-center justify-between text-sm text-primary">
                                <span>
                                    Discount
                                    {order.coupon_code
                                        ? ` (${order.coupon_code})`
                                        : ''}
                                </span>
                                <span>−{order.formatted_discount}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>{order.formatted_total}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Payment</span>
                            <span className="capitalize">
                                {order.payment_status} · Cash on Delivery
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery */}
                {(order.address || order.customer_name) && (
                    <Card className="rounded-2xl">
                        <CardContent className="flex flex-col gap-2 text-sm">
                            <h2 className="font-semibold">Delivery details</h2>
                            {order.customer_name && (
                                <p>{order.customer_name}</p>
                            )}
                            {order.phone && (
                                <p className="text-muted-foreground">
                                    {order.phone}
                                </p>
                            )}
                            {order.address && (
                                <p className="text-muted-foreground">
                                    {[
                                        order.address,
                                        order.city,
                                        order.district,
                                        order.postcode,
                                    ]
                                        .filter(Boolean)
                                        .join(', ')}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Returns */}
                {(returns.length > 0 || canReturn) && (
                    <Card className="rounded-2xl">
                        <CardContent className="flex flex-col gap-4">
                            <h2 className="flex items-center gap-2 font-semibold">
                                <RotateCcw className="size-4 text-primary" />
                                Returns
                            </h2>

                            {returns.map((ret) => (
                                <div
                                    key={ret.id}
                                    className="rounded-lg border p-3 text-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            {ret.status_label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {ret.created_at &&
                                                new Date(
                                                    ret.created_at,
                                                ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-muted-foreground">
                                        {ret.reason}
                                    </p>
                                    {ret.admin_note && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Store reply: {ret.admin_note}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {canReturn && (
                                <form
                                    onSubmit={submitReturn}
                                    className="flex flex-col gap-2"
                                >
                                    <label
                                        htmlFor="reason"
                                        className="text-sm font-medium"
                                    >
                                        Request a return / exchange
                                    </label>
                                    <textarea
                                        id="reason"
                                        value={returnForm.data.reason}
                                        onChange={(e) =>
                                            returnForm.setData(
                                                'reason',
                                                e.target.value,
                                            )
                                        }
                                        rows={3}
                                        placeholder="Tell us what went wrong (size, defect, wrong item…)"
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                    <InputError
                                        message={returnForm.errors.reason}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-fit rounded-full"
                                        disabled={returnForm.processing}
                                    >
                                        Submit return request
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
