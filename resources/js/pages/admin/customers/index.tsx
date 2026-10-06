import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import admin from '@/routes/admin';
import type { Paginated } from '@/types';

type CustomerRow = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    orders_count: number;
    spent: string;
    created_at: string | null;
};

type Props = {
    customers: Paginated<CustomerRow>;
    filters: { q: string };
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

export default function CustomersIndex({ customers, filters }: Props) {
    const [q, setQ] = useState(filters.q ?? '');

    function submitSearch(event: React.FormEvent) {
        event.preventDefault();
        router.get(
            admin.customers.index.url(),
            { q },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Customers" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                    Customers
                </h1>

                <form onSubmit={submitSearch} className="relative max-w-md">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search customers..."
                        className="pl-9"
                    />
                </form>

                <Card className="rounded-2xl">
                    <CardContent className="p-0">
                        {customers.data.length === 0 ? (
                            <p className="py-12 text-center text-sm text-muted-foreground">
                                No customers found.
                            </p>
                        ) : (
                            <div className="flex flex-col divide-y">
                                {customers.data.map((customer) => (
                                    <Link
                                        key={customer.id}
                                        href={admin.customers.show.url(
                                            customer.id,
                                        )}
                                        className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <span className="truncate font-medium">
                                                {customer.name}
                                            </span>
                                            <span className="truncate text-sm text-muted-foreground">
                                                {customer.email ??
                                                    customer.phone ??
                                                    '—'}
                                            </span>
                                        </div>
                                        <div className="hidden w-24 text-center sm:block">
                                            <span className="text-sm text-muted-foreground">
                                                {customer.orders_count} order
                                                {customer.orders_count === 1
                                                    ? ''
                                                    : 's'}
                                            </span>
                                        </div>
                                        <div className="w-24 text-right font-semibold">
                                            {customer.spent}
                                        </div>
                                        <div className="hidden w-28 text-right text-sm text-muted-foreground md:block">
                                            {formatDate(customer.created_at)}
                                        </div>
                                        <ChevronRight className="size-4 text-muted-foreground" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        {customers.total} total
                    </span>
                    <div className="flex gap-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            disabled={!customers.prev_page_url}
                        >
                            {customers.prev_page_url ? (
                                <Link href={customers.prev_page_url}>
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
                            disabled={!customers.next_page_url}
                        >
                            {customers.next_page_url ? (
                                <Link href={customers.next_page_url}>Next</Link>
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
