import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Receipt, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { orderStatusPill } from '@/lib/shop';
import admin from '@/routes/admin';

type Customer = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    created_at: string | null;
};

type Stats = {
    orders: number;
    spent: string;
    addresses: number;
};

type OrderRow = {
    id: number;
    order_number: string;
    status: string;
    status_label: string;
    payment_status: string;
    formatted_total: string;
    paid_at: string | null;
    created_at: string | null;
};

type Address = {
    id: number;
    label: string | null;
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postcode: string | null;
    is_default: boolean;
};

type Props = {
    customer: Customer;
    stats: Stats;
    orders: OrderRow[];
    addresses: Address[];
};

function formatDate(value: string | null): string {
    return value
        ? new Date(value).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : '—';
}

function paymentPill(status: string): string {
    return status === 'paid'
        ? 'bg-lime-500/10 text-lime-600 border-lime-500/20'
        : 'bg-amber-500/10 text-amber-600 border-amber-500/20';
}

export default function CustomerShow({
    customer,
    stats,
    orders,
    addresses,
}: Props) {
    return (
        <>
            <Head title={customer.name} />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <Link
                        href={admin.customers.index.url()}
                        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to customers
                    </Link>
                    <h1 className="font-display text-2xl font-semibold tracking-tight">
                        {customer.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {[customer.email, customer.phone]
                            .filter(Boolean)
                            .join(' · ') || 'No contact details'}
                        {customer.created_at
                            ? ` · Joined ${formatDate(customer.created_at)}`
                            : ''}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Card className="rounded-2xl">
                        <CardContent className="flex items-center justify-between gap-4 p-5">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">
                                    Orders
                                </span>
                                <span className="font-display text-2xl font-semibold tracking-tight">
                                    {stats.orders}
                                </span>
                            </div>
                            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Receipt className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl">
                        <CardContent className="flex items-center justify-between gap-4 p-5">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">
                                    Spent
                                </span>
                                <span className="font-display text-2xl font-semibold tracking-tight">
                                    {stats.spent}
                                </span>
                            </div>
                            <div className="flex size-11 items-center justify-center rounded-xl bg-lime/15 text-lime-ink">
                                <Wallet className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl">
                        <CardContent className="flex items-center justify-between gap-4 p-5">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">
                                    Addresses
                                </span>
                                <span className="font-display text-2xl font-semibold tracking-tight">
                                    {stats.addresses}
                                </span>
                            </div>
                            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <MapPin className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle>Order &amp; payment history</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {orders.length === 0 ? (
                            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
                                No orders yet.
                            </p>
                        ) : (
                            <div className="flex flex-col divide-y">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex flex-wrap items-center gap-4 px-6 py-4"
                                    >
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <Link
                                                href={admin.orders.show.url(
                                                    order.id,
                                                )}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {order.order_number}
                                            </Link>
                                            <span className="text-sm text-muted-foreground">
                                                Placed{' '}
                                                {formatDate(order.created_at)}
                                                {order.paid_at
                                                    ? ` · Paid ${formatDate(
                                                          order.paid_at,
                                                      )}`
                                                    : ''}
                                            </span>
                                        </div>
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
                                                paymentPill(
                                                    order.payment_status,
                                                ),
                                            )}
                                        >
                                            {order.payment_status}
                                        </span>
                                        <span className="w-24 text-right font-semibold">
                                            {order.formatted_total}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle>Addresses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {addresses.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                No saved addresses.
                            </p>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className="flex flex-col gap-1 rounded-xl border p-4 text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {address.label ?? 'Address'}
                                            </span>
                                            {address.is_default && (
                                                <Badge variant="secondary">
                                                    Default
                                                </Badge>
                                            )}
                                        </div>
                                        <span>{address.name}</span>
                                        <span className="text-muted-foreground">
                                            {address.phone}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {address.address}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {[
                                                address.city,
                                                address.district,
                                                address.postcode,
                                            ]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
