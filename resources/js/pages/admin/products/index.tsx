import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ImageIcon, Pencil, Plus, Search, Tag, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';
import type { Paginated } from '@/types';

type ProductRow = {
    id: number;
    name: string;
    category: string | null;
    formatted_price: string;
    discount_percent: number;
    stock: number;
    variants_count: number;
    is_active: boolean;
    image: string | null;
};

type Props = {
    products: Paginated<ProductRow>;
    filters: { q: string };
};

export default function ProductsIndex({ products, filters }: Props) {
    const [q, setQ] = useState(filters.q ?? '');

    function submitSearch(event: React.FormEvent) {
        event.preventDefault();
        router.get(
            admin.products.index.url(),
            { q },
            { preserveState: true, replace: true },
        );
    }

    function destroy(product: ProductRow) {
        if (
            !window.confirm(`Delete "${product.name}"? This cannot be undone.`)
        ) {
            return;
        }
        router.delete(admin.products.destroy.url(product.id), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Products" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="font-display text-2xl font-semibold tracking-tight">
                        Products
                    </h1>
                    <Button asChild>
                        <Link href={admin.products.create.url()}>
                            <Plus className="size-4" />
                            New product
                        </Link>
                    </Button>
                </div>

                <form
                    onSubmit={submitSearch}
                    className="flex max-w-md items-center gap-2"
                >
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search products..."
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="secondary">
                        Search
                    </Button>
                </form>

                <StoreWideDiscount />

                <Card className="rounded-2xl">
                    <CardContent className="p-0">
                        {products.data.length === 0 ? (
                            <p className="py-12 text-center text-sm text-muted-foreground">
                                No products found.
                            </p>
                        ) : (
                            <div className="flex flex-col divide-y">
                                {products.data.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-4 p-4"
                                    >
                                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="size-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <span className="truncate font-medium">
                                                {product.name}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {product.category ??
                                                    'Uncategorised'}
                                                {' · '}
                                                {product.variants_count} variant
                                                {product.variants_count === 1
                                                    ? ''
                                                    : 's'}
                                            </span>
                                        </div>
                                        <div className="hidden w-24 text-right sm:block">
                                            <span className="font-semibold">
                                                {product.formatted_price}
                                            </span>
                                            {product.discount_percent > 0 && (
                                                <span className="block text-xs font-medium text-primary">
                                                    -{product.discount_percent}%
                                                    off
                                                </span>
                                            )}
                                        </div>
                                        <div className="hidden w-20 text-right sm:block">
                                            <span
                                                className={cn(
                                                    'text-sm font-medium',
                                                    product.stock < 10
                                                        ? product.stock <= 0
                                                            ? 'text-destructive'
                                                            : 'text-amber-600'
                                                        : 'text-muted-foreground',
                                                )}
                                            >
                                                {product.stock} in stock
                                            </span>
                                        </div>
                                        <div className="w-20 text-center">
                                            <Badge
                                                variant={
                                                    product.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {product.is_active
                                                    ? 'Active'
                                                    : 'Hidden'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={admin.products.edit.url(
                                                        product.id,
                                                    )}
                                                >
                                                    <Pencil className="size-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => destroy(product)}
                                            >
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between pb-6">
                    <span className="text-sm text-muted-foreground">
                        {products.total} total
                    </span>
                    <div className="flex gap-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            disabled={!products.prev_page_url}
                        >
                            {products.prev_page_url ? (
                                <Link href={products.prev_page_url}>
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
                            disabled={!products.next_page_url}
                        >
                            {products.next_page_url ? (
                                <Link href={products.next_page_url}>Next</Link>
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

function StoreWideDiscount() {
    const [percent, setPercent] = useState('');
    const [onlyActive, setOnlyActive] = useState(true);
    const [processing, setProcessing] = useState(false);

    function apply(clear = false) {
        const value = clear ? 0 : parseInt(percent, 10);
        if (!clear && (Number.isNaN(value) || value < 0 || value > 90)) {
            return;
        }
        const label = clear
            ? 'Clear the discount on every product?'
            : `Apply ${value}% off to ${onlyActive ? 'all active' : 'all'} products?`;
        if (!window.confirm(label)) {
            return;
        }
        setProcessing(true);
        router.post(
            '/admin/products/discount-all',
            { discount_percent: value, only_active: onlyActive },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => setPercent(''),
            },
        );
    }

    return (
        <Card className="rounded-2xl border-primary/20 bg-primary/[0.03]">
            <CardContent className="flex flex-wrap items-end gap-4 p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="size-4 text-primary" />
                    Store-wide discount
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="bulk-discount" className="text-xs">
                        Percentage off
                    </Label>
                    <Input
                        id="bulk-discount"
                        type="number"
                        min="0"
                        max="90"
                        placeholder="e.g. 15"
                        value={percent}
                        onChange={(e) => setPercent(e.target.value)}
                        className="h-9 w-28"
                    />
                </div>
                <label className="flex items-center gap-2 pb-2 text-sm">
                    <input
                        type="checkbox"
                        checked={onlyActive}
                        onChange={(e) => setOnlyActive(e.target.checked)}
                        className="size-4 rounded border-input accent-primary"
                    />
                    Active products only
                </label>
                <div className="ml-auto flex items-center gap-2 pb-0.5">
                    <Button
                        type="button"
                        onClick={() => apply(false)}
                        disabled={processing || percent === ''}
                    >
                        Apply to all
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => apply(true)}
                        disabled={processing}
                    >
                        Clear all
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
