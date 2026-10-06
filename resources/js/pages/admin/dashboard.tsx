import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Clock,
    Package,
    RotateCcw,
    ShoppingBag,
    TrendingUp,
    Users,
} from 'lucide-react';
import { AreaChart, BarList, DonutChart } from '@/components/admin/charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { orderStatusPill } from '@/lib/shop';
import admin from '@/routes/admin';

type Stats = {
    revenue: string;
    orders: number;
    pending: number;
    products: number;
    customers: number;
    returns: number;
    low_stock: number;
};

type RecentOrder = {
    id: number;
    order_number: string;
    customer: string | null;
    status: string;
    status_label: string;
    payment_status: string;
    formatted_total: string;
    created_at: string | null;
};

type Props = {
    stats: Stats;
    salesSeries: { label: string; orders: number; revenue: number }[];
    statusBreakdown: { status: string; label: string; count: number }[];
    categoryBreakdown: { label: string; count: number }[];
    recentOrders: RecentOrder[];
};

const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    processing: '#0ea5e9',
    shipped: '#8b5cf6',
    completed: '#10b981',
    cancelled: '#ef4444',
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

function StatCard({
    label,
    value,
    icon: Icon,
    href,
    accent,
}: {
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    accent?: string;
}) {
    const inner = (
        <Card className="h-full rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="flex items-center justify-between gap-4 p-5">
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                        {label}
                    </span>
                    <span className="font-display text-2xl font-semibold tracking-tight">
                        {value}
                    </span>
                </div>
                <div
                    className={cn(
                        'flex size-11 items-center justify-center rounded-xl',
                        accent ?? 'bg-primary/10 text-primary',
                    )}
                >
                    <Icon className="size-5" />
                </div>
            </CardContent>
        </Card>
    );

    return href ? (
        <Link href={href} className="group">
            {inner}
        </Link>
    ) : (
        inner
    );
}

/**
 * A stat tile that grows to fill its column (flex-1), used in the vertical
 * stack beside the taller category card so the heights stay balanced.
 */
function MiniStat({
    label,
    value,
    icon: Icon,
    href,
    accent,
}: {
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    accent: string;
}) {
    return (
        <Link href={href} className="group flex flex-1">
            <Card className="h-full w-full rounded-2xl transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                <CardContent className="flex h-full items-center justify-between gap-4 p-5">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">
                            {label}
                        </span>
                        <span className="font-display text-3xl font-semibold tracking-tight">
                            {value}
                        </span>
                    </div>
                    <div
                        className={cn(
                            'flex size-11 items-center justify-center rounded-xl',
                            accent,
                        )}
                    >
                        <Icon className="size-5" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default function AdminDashboard({
    stats,
    salesSeries,
    statusBreakdown,
    categoryBreakdown,
    recentOrders,
}: Props) {
    const segments = statusBreakdown.map((s) => ({
        label: s.label,
        value: s.count,
        color: statusColors[s.status] ?? '#9ca3af',
    }));

    return (
        <>
            <Head title="Dashboard" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="font-display text-2xl font-semibold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of your store activity.
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <StatCard
                        label="Revenue"
                        value={stats.revenue}
                        icon={TrendingUp}
                        accent="bg-lime/15 text-lime-ink"
                    />
                    <StatCard
                        label="Orders"
                        value={stats.orders}
                        icon={ShoppingBag}
                        href={admin.orders.index.url()}
                    />
                    <StatCard
                        label="Customers"
                        value={stats.customers}
                        icon={Users}
                        href={admin.customers.index.url()}
                    />
                    <StatCard
                        label="Pending orders"
                        value={stats.pending}
                        icon={Clock}
                        href={admin.orders.index.url()}
                        accent="bg-amber-500/10 text-amber-600"
                    />
                </div>

                {/* Charts */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="rounded-2xl lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Orders — last 14 days</CardTitle>
                                <span className="text-sm text-muted-foreground">
                                    Revenue:{' '}
                                    <span className="font-semibold text-foreground">
                                        {stats.revenue}
                                    </span>
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <AreaChart
                                data={salesSeries.map((d) => ({
                                    label: d.label,
                                    value: d.orders,
                                }))}
                            />
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle>Orders by status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DonutChart segments={segments} />
                        </CardContent>
                    </Card>
                </div>

                {/* Category + inventory snapshot */}
                <div className="grid items-stretch gap-4 lg:grid-cols-3">
                    <Card className="rounded-2xl lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Products by category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BarList
                                items={categoryBreakdown.map((c) => ({
                                    label: c.label,
                                    value: c.count,
                                }))}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-4">
                        <MiniStat
                            label="Products"
                            value={stats.products}
                            icon={Package}
                            href={admin.products.index.url()}
                            accent="bg-primary/10 text-primary"
                        />
                        <MiniStat
                            label="Returns"
                            value={stats.returns}
                            icon={RotateCcw}
                            href={admin.returns.index.url()}
                            accent="bg-lime/15 text-lime-ink"
                        />
                        <MiniStat
                            label="Low stock"
                            value={stats.low_stock}
                            icon={AlertTriangle}
                            href={admin.products.index.url()}
                            accent={
                                stats.low_stock > 0
                                    ? 'bg-destructive/10 text-destructive'
                                    : 'bg-lime-500/10 text-lime-600'
                            }
                        />
                    </div>
                </div>

                {/* Recent orders */}
                <Card className="rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent orders</CardTitle>
                        <Link
                            href={admin.orders.index.url()}
                            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                            View all
                            <ArrowRight className="size-4" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No orders yet.
                            </p>
                        ) : (
                            <div className="flex flex-col divide-y">
                                {recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={admin.orders.show.url(order.id)}
                                        className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium">
                                                {order.order_number}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {order.customer ?? 'Guest'} ·{' '}
                                                {formatDate(order.created_at)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={cn(
                                                    'rounded-full border px-3 py-1 text-xs font-medium',
                                                    orderStatusPill(
                                                        order.status,
                                                    ),
                                                )}
                                            >
                                                {order.status_label}
                                            </span>
                                            <span
                                                className={cn(
                                                    'hidden rounded-full border px-3 py-1 text-xs font-medium capitalize sm:inline',
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
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
