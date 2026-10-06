import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import type { Paginated } from '@/types';

type OrderRow = {
    id: number;
    order_number: string;
    customer: string | null;
    status: string;
    status_label: string;
    payment_status: string;
    formatted_total: string;
    items_count: number;
    created_at: string | null;
};

type Filters = { status: string; payment: string; q: string };

type Props = {
    orders: Paginated<OrderRow>;
    filters: Filters;
    statuses: { value: string; label: string }[];
};

const ALL = '__all__';

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

export default function OrdersIndex({ orders, filters, statuses }: Props) {
    const [q, setQ] = useState(filters.q ?? '');

    function applyFilters(next: Partial<Filters>) {
        const merged: Filters = { ...filters, q, ...next };
        const query: Record<string, string> = {};
        (Object.keys(merged) as (keyof Filters)[]).forEach((key) => {
            if (merged[key]) {
                query[key] = merged[key];
            }
        });
        router.get(admin.orders.index.url(), query, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <>
            <Head title="Orders" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                    Orders
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilters({});
                        }}
                        className="relative min-w-[16rem] flex-1"
                    >
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search orders..."
                            className="pl-9"
                        />
                    </form>

                    <Select
                        value={filters.status || ALL}
                        onValueChange={(value) =>
                            applyFilters({
                                status: value === ALL ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All statuses</SelectItem>
                            {statuses.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.payment || ALL}
                        onValueChange={(value) =>
                            applyFilters({
                                payment: value === ALL ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All payments" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All payments</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="rounded-2xl">
                    <CardContent className="p-0">
                        {orders.data.length === 0 ? (
                            <p className="py-12 text-center text-sm text-muted-foreground">
                                No orders found.
                            </p>
                        ) : (
                            <div className="flex flex-col divide-y">
                                {orders.data.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex flex-wrap items-center gap-4 p-4"
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
                                                {order.customer ?? 'Guest'} ·{' '}
                                                {order.items_count} item
                                                {order.items_count === 1
                                                    ? ''
                                                    : 's'}
                                                {' · '}
                                                {formatDate(order.created_at)}
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

                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        {orders.total} total
                    </span>
                    <div className="flex gap-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            disabled={!orders.prev_page_url}
                        >
                            {orders.prev_page_url ? (
                                <Link href={orders.prev_page_url}>
                                    Previous
                                </Link>
                            ) : (
                                <span>Previous</span>
                            )}
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            disabled={!orders.next_page_url}
                        >
                            {orders.next_page_url ? (
                                <Link href={orders.next_page_url}>Next</Link>
                            ) : (
                                <span>Next</span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
