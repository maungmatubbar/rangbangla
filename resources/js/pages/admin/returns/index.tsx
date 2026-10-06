import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import admin from '@/routes/admin';
import type { Paginated } from '@/types';

type ReturnRow = {
    id: number;
    order_number: string | null;
    order_id: number;
    customer: string | null;
    status: string;
    status_label: string;
    reason: string;
    admin_note: string | null;
    created_at: string | null;
};

type Props = {
    returns: Paginated<ReturnRow>;
    filters: { status: string };
    statuses: string[];
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

function ReturnCard({
    item,
    statuses,
}: {
    item: ReturnRow;
    statuses: string[];
}) {
    const form = useForm({
        status: item.status,
        admin_note: item.admin_note ?? '',
    });

    function save(event: React.FormEvent) {
        event.preventDefault();
        form.patch(admin.returns.update.url(item.id), {
            preserveScroll: true,
        });
    }

    return (
        <Card className="rounded-2xl">
            <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Link
                                href={admin.orders.show.url(item.order_id)}
                                className="font-medium text-primary hover:underline"
                            >
                                {item.order_number ?? `Order #${item.order_id}`}
                            </Link>
                            <span className="rounded-full border bg-muted px-3 py-1 text-xs font-medium capitalize">
                                {item.status_label}
                            </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {item.customer ?? 'Guest'} ·{' '}
                            {formatDate(item.created_at)}
                        </span>
                    </div>
                </div>

                <div className="rounded-xl bg-muted/50 p-3 text-sm">
                    <span className="font-medium">Reason: </span>
                    {item.reason}
                </div>

                <form
                    onSubmit={save}
                    className="flex flex-wrap items-end gap-3 border-t pt-4"
                >
                    <div className="grid gap-1">
                        <Label className="text-xs">Status</Label>
                        <Select
                            value={form.data.status}
                            onValueChange={(value) =>
                                form.setData('status', value)
                            }
                        >
                            <SelectTrigger className="w-44">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        <span className="capitalize">
                                            {status}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid flex-1 gap-1">
                        <Label className="text-xs">Admin note</Label>
                        <Input
                            value={form.data.admin_note}
                            onChange={(e) =>
                                form.setData('admin_note', e.target.value)
                            }
                            placeholder="Optional note"
                        />
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        Save
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function ReturnsIndex({ returns, filters, statuses }: Props) {
    function applyStatus(value: string) {
        router.get(admin.returns.index.url(), value ? { status: value } : {}, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <>
            <Head title="Return requests" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="font-display text-2xl font-semibold tracking-tight">
                        Return requests
                    </h1>
                    <Select
                        value={filters.status || ALL}
                        onValueChange={(value) =>
                            applyStatus(value === ALL ? '' : value)
                        }
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All statuses</SelectItem>
                            {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    <span className="capitalize">{status}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {returns.data.length === 0 ? (
                    <Card className="rounded-2xl">
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            No return requests found.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-4">
                        {returns.data.map((item) => (
                            <ReturnCard
                                key={item.id}
                                item={item}
                                statuses={statuses}
                            />
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        {returns.total} total
                    </span>
                    <div className="flex gap-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            disabled={!returns.prev_page_url}
                        >
                            {returns.prev_page_url ? (
                                <Link href={returns.prev_page_url}>
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
                            disabled={!returns.next_page_url}
                        >
                            {returns.next_page_url ? (
                                <Link href={returns.next_page_url}>Next</Link>
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
