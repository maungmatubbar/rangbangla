import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { orderStatusPill } from '@/lib/shop';
import admin from '@/routes/admin';

type OrderItem = {
    id: number;
    product_name: string;
    variant_label: string | null;
    quantity: number;
    formatted_line_total: string;
};

type Shipping = {
    name: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    district: string | null;
    postcode: string | null;
    note: string | null;
};

type Customer = {
    id: number | null;
    name: string | null;
    email: string | null;
    phone: string | null;
};

type OrderReturn = {
    id: number;
    status: string;
    reason: string;
};

type Order = {
    id: number;
    order_number: string;
    status: string;
    status_label: string;
    payment_status: string;
    formatted_total: string;
    subtotal: string;
    discount: number;
    formatted_discount: string;
    coupon_code: string | null;
    items_count: number;
    payment_method: string | null;
    tracking_number: string | null;
    admin_note: string | null;
    created_at: string | null;
    shipping: Shipping;
    customer: Customer;
    items: OrderItem[];
    returns: OrderReturn[];
};

type Props = {
    order: Order;
    statuses: { value: string; label: string }[];
};

function formatDate(value: string | null): string {
    return value
        ? new Date(value).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : '';
}

function paymentPill(status: string): string {
    return status === 'paid'
        ? 'bg-lime-500/10 text-lime-600 border-lime-500/20'
        : 'bg-amber-500/10 text-amber-600 border-amber-500/20';
}

export default function OrderShow({ order, statuses }: Props) {
    const form = useForm({
        status: order.status,
        payment_status: order.payment_status,
        tracking_number: order.tracking_number ?? '',
        admin_note: order.admin_note ?? '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        form.patch(admin.orders.update.url(order.id), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={order.order_number} />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <Link
                        href={admin.orders.index.url()}
                        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to orders
                    </Link>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="font-display text-2xl font-semibold tracking-tight">
                            {order.order_number}
                        </h1>
                        <span
                            className={cn(
                                'rounded-full border px-3 py-1 text-xs font-medium',
                                orderStatusPill(order.status),
                            )}
                        >
                            {order.status_label}
                        </span>
                        <span
                            className={cn(
                                'rounded-full border px-3 py-1 text-xs font-medium capitalize',
                                paymentPill(order.payment_status),
                            )}
                        >
                            {order.payment_status}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)}
                        </span>
                        <Button asChild variant="outline" className="ml-auto">
                            <a
                                href={admin.orders.invoice.url(order.id)}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FileText className="size-4" />
                                Invoice
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle>Items</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-4"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {item.product_name}
                                            </span>
                                            {item.variant_label && (
                                                <span className="text-sm text-muted-foreground">
                                                    {item.variant_label}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-sm text-muted-foreground">
                                                ×{item.quantity}
                                            </span>
                                            <span className="w-24 text-right font-semibold">
                                                {item.formatted_line_total}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span>{order.subtotal}</span>
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
                                <div className="flex items-center justify-between text-base font-semibold">
                                    <span>Total</span>
                                    <span>{order.formatted_total}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle>Manage order</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={submit}
                                    className="flex flex-col gap-5"
                                >
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label>Status</Label>
                                            <Select
                                                value={form.data.status}
                                                onValueChange={(value) =>
                                                    form.setData(
                                                        'status',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statuses.map((s) => (
                                                        <SelectItem
                                                            key={s.value}
                                                            value={s.value}
                                                        >
                                                            {s.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Payment status</Label>
                                            <Select
                                                value={form.data.payment_status}
                                                onValueChange={(value) =>
                                                    form.setData(
                                                        'payment_status',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unpaid">
                                                        Unpaid
                                                    </SelectItem>
                                                    <SelectItem value="paid">
                                                        Paid
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="tracking_number">
                                            Tracking number
                                        </Label>
                                        <Input
                                            id="tracking_number"
                                            value={form.data.tracking_number}
                                            onChange={(e) =>
                                                form.setData(
                                                    'tracking_number',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="admin_note">
                                            Admin note
                                        </Label>
                                        <textarea
                                            id="admin_note"
                                            value={form.data.admin_note}
                                            onChange={(e) =>
                                                form.setData(
                                                    'admin_note',
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={form.processing}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {order.returns.length > 0 && (
                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle>Returns</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    {order.returns.map((ret) => (
                                        <div
                                            key={ret.id}
                                            className="flex items-start justify-between gap-4"
                                        >
                                            <span className="text-sm">
                                                {ret.reason}
                                            </span>
                                            <span className="rounded-full border bg-muted px-3 py-1 text-xs font-medium capitalize">
                                                {ret.status}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle>Customer</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-1 text-sm">
                                <span className="font-medium">
                                    {order.customer.name ?? 'Guest'}
                                </span>
                                {order.customer.email && (
                                    <span className="text-muted-foreground">
                                        {order.customer.email}
                                    </span>
                                )}
                                {order.customer.phone && (
                                    <span className="text-muted-foreground">
                                        {order.customer.phone}
                                    </span>
                                )}
                                {order.customer.id && (
                                    <Link
                                        href={admin.customers.show.url(
                                            order.customer.id,
                                        )}
                                        className="mt-1 w-fit text-primary hover:underline"
                                    >
                                        View customer
                                    </Link>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle>Shipping</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-1 text-sm">
                                {order.shipping.name && (
                                    <span className="font-medium">
                                        {order.shipping.name}
                                    </span>
                                )}
                                {order.shipping.phone && (
                                    <span className="text-muted-foreground">
                                        {order.shipping.phone}
                                    </span>
                                )}
                                {order.shipping.address && (
                                    <span className="text-muted-foreground">
                                        {order.shipping.address}
                                    </span>
                                )}
                                <span className="text-muted-foreground">
                                    {[
                                        order.shipping.city,
                                        order.shipping.district,
                                        order.shipping.postcode,
                                    ]
                                        .filter(Boolean)
                                        .join(', ')}
                                </span>
                                {order.shipping.note && (
                                    <span className="mt-1 text-muted-foreground">
                                        Note: {order.shipping.note}
                                    </span>
                                )}
                                {order.payment_method && (
                                    <span className="mt-2 text-muted-foreground">
                                        Payment: {order.payment_method}
                                    </span>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
