import { Head, Link } from '@inertiajs/react';
import { Heart, MapPin, Package } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AccountShell } from '@/components/storefront/account/account-shell';
import { cn } from '@/lib/utils';
import { orderStatusPill } from '@/lib/shop';
import account from '@/routes/account';
import shop from '@/routes/shop';
import type { OrderListItem } from '@/types';

type Props = {
    stats: { orders: number; wishlist: number; addresses: number };
    profile: { name: string; email: string | null; phone: string | null };
    recentOrders: OrderListItem[];
};

export default function AccountOverview({
    stats,
    profile,
    recentOrders,
}: Props) {
    const cards: {
        label: string;
        value: number;
        href: string;
        icon: LucideIcon;
    }[] = [
        {
            label: 'Orders',
            value: stats.orders,
            href: shop.orders.index.url(),
            icon: Package,
        },
        {
            label: 'Wishlist',
            value: stats.wishlist,
            href: shop.wishlist.index.url(),
            icon: Heart,
        },
        {
            label: 'Addresses',
            value: stats.addresses,
            href: account.addresses.index.url(),
            icon: MapPin,
        },
    ];

    return (
        <>
            <Head title="My Account" />
            <AccountShell
                active="overview"
                title={`Hello, ${profile.name.split(' ')[0]} 👋`}
                description="Manage your orders, wishlist and delivery details."
            >
                <div className="flex flex-col gap-6">
                    {/* Profile summary */}
                    <Card className="rounded-2xl">
                        <CardContent className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-col gap-0.5">
                                <span className="font-display text-xl font-semibold">
                                    {profile.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {profile.phone ?? profile.email ?? '—'}
                                </span>
                            </div>
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full"
                            >
                                <Link href={shop.products.index.url()}>
                                    Continue shopping
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Stat cards */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        {cards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <Link key={card.label} href={card.href}>
                                    <Card className="h-full rounded-2xl transition-shadow hover:shadow-md">
                                        <CardContent className="flex items-center gap-4">
                                            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Icon className="size-5" />
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-semibold">
                                                    {card.value}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {card.label}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Recent orders */}
                    <Card className="rounded-2xl">
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold">Recent orders</h2>
                                <Link
                                    href={shop.orders.index.url()}
                                    className="text-sm text-primary hover:underline"
                                >
                                    View all
                                </Link>
                            </div>

                            {recentOrders.length === 0 ? (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    You haven't placed any orders yet.
                                </p>
                            ) : (
                                <div className="flex flex-col divide-y">
                                    {recentOrders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={shop.orders.show.url(
                                                order.id,
                                            )}
                                            className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {order.order_number}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {order.items_count} item
                                                    {order.items_count === 1
                                                        ? ''
                                                        : 's'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={cn(
                                                        'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                                                        orderStatusPill(
                                                            order.status,
                                                        ),
                                                    )}
                                                >
                                                    {order.status_label}
                                                </span>
                                                <span className="font-medium">
                                                    {order.formatted_total}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AccountShell>
        </>
    );
}
