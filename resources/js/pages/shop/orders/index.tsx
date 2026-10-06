import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AccountShell } from '@/components/storefront/account/account-shell';
import { cn } from '@/lib/utils';
import { orderStatusPill } from '@/lib/shop';
import shop from '@/routes/shop';
import type { OrderListItem, Paginated } from '@/types';

type Props = {
    orders: Paginated<OrderListItem>;
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

export default function OrdersIndex({ orders }: Props) {
    return (
        <>
            <Head title="Orders" />
            <AccountShell
                active="orders"
                title="My orders"
                description="Track and review your orders."
            >
                {orders.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed py-16 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                            <Package className="size-7 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">
                                No orders yet
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Your placed orders will appear here.
                            </p>
                        </div>
                        <Button asChild className="rounded-full">
                            <Link href={shop.products.index()}>
                                Start shopping
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {orders.data.map((order) => (
                            <Link
                                key={order.id}
                                href={shop.orders.show(order.id)}
                                className="group"
                            >
                                <Card className="flex flex-row items-center justify-between gap-4 rounded-2xl p-4 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold">
                                            {order.order_number}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {formatDate(order.created_at)} ·{' '}
                                            {order.items_count} item
                                            {order.items_count === 1 ? '' : 's'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold">
                                            {order.formatted_total}
                                        </span>
                                        <span
                                            className={cn(
                                                'rounded-full border px-3 py-1 text-xs font-medium',
                                                orderStatusPill(order.status),
                                            )}
                                        >
                                            {order.status_label}
                                        </span>
                                        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </AccountShell>
        </>
    );
}
