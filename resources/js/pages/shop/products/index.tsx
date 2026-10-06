import { Head, Link, router } from '@inertiajs/react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { ProductCard } from '@/components/storefront/product-card';
import { Reveal } from '@/components/storefront/reveal';
import { ShopFilters } from '@/components/storefront/shop/shop-filters';
import { StoreSearch } from '@/components/storefront/store-search';
import shop from '@/routes/shop';
import type { Paginated, Product, ProductColor, ProductFilters } from '@/types';

type Props = {
    products: Paginated<Product>;
    categories: string[];
    sizes: string[];
    colors: ProductColor[];
    filters: ProductFilters;
};

const sortOptions = [
    { value: 'name', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
];

export default function ProductsIndex({
    products,
    categories,
    sizes,
    colors,
    filters,
}: Props) {
    const apply = (patch: Partial<ProductFilters>) => {
        const next = { ...filters, ...patch };
        router.get(
            shop.products.index.url(),
            {
                q: next.q || undefined,
                category: next.category || undefined,
                size: next.size || undefined,
                color: next.color || undefined,
                min: next.min || undefined,
                max: next.max || undefined,
                sort: next.sort && next.sort !== 'name' ? next.sort : undefined,
                sale: next.sale ? 1 : undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const clear = () => {
        router.get(
            shop.products.index.url(),
            {},
            { preserveScroll: true, replace: true },
        );
    };

    const activeChips = buildChips(filters);

    return (
        <>
            <Head title="Shop" />

            {/* Page header */}
            <div className="border-b bg-secondary/30">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:px-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-brand text-xs font-semibold tracking-[0.2em] uppercase">
                            The Collection
                        </span>
                        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                            {filters.category ||
                                (filters.sale ? 'On Sale' : 'All Products')}
                        </h1>
                    </div>
                    <div className="max-w-md">
                        <StoreSearch />
                    </div>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 md:px-6">
                {/* Desktop sidebar */}
                <aside className="hidden w-64 shrink-0 lg:block">
                    <div className="sticky top-24">
                        <ShopFilters
                            filters={filters}
                            categories={categories}
                            sizes={sizes}
                            colors={colors}
                            onChange={apply}
                            onClear={clear}
                        />
                    </div>
                </aside>

                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            {/* Mobile filter trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 lg:hidden"
                                    >
                                        <SlidersHorizontal className="size-4" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="w-80 overflow-y-auto"
                                >
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                    <div className="px-4 pb-6">
                                        <ShopFilters
                                            filters={filters}
                                            categories={categories}
                                            sizes={sizes}
                                            colors={colors}
                                            onChange={apply}
                                            onClear={clear}
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <span className="text-sm text-muted-foreground">
                                {products.total} product
                                {products.total === 1 ? '' : 's'}
                            </span>
                        </div>

                        <Select
                            value={filters.sort || 'name'}
                            onValueChange={(value) => apply({ sort: value })}
                        >
                            <SelectTrigger className="w-44" size="sm">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Active filter chips */}
                    {activeChips.length > 0 && (
                        <div className="mb-5 flex flex-wrap items-center gap-2">
                            {activeChips.map((chip) => (
                                <button
                                    key={chip.key}
                                    type="button"
                                    onClick={() => apply(chip.clear)}
                                    className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs font-medium hover:border-primary"
                                >
                                    {chip.label}
                                    <X className="size-3" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Grid */}
                    {products.data.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-20 text-center">
                            <SlidersHorizontal className="size-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                                No products match your filters
                                {filters.q ? ` for “${filters.q}”` : ''}.
                            </p>
                            <Button variant="outline" onClick={clear}>
                                Clear filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {products.data.map((product, index) => (
                                <Reveal
                                    key={product.id}
                                    delay={(index % 3) * 80}
                                >
                                    <ProductCard product={product} />
                                </Reveal>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {(products.prev_page_url || products.next_page_url) && (
                        <div className="mt-10 flex items-center justify-between">
                            <PaginationButton
                                href={products.prev_page_url}
                                label="Previous"
                            />
                            <span className="text-sm text-muted-foreground">
                                Page {products.current_page} of{' '}
                                {products.last_page}
                            </span>
                            <PaginationButton
                                href={products.next_page_url}
                                label="Next"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function PaginationButton({
    href,
    label,
}: {
    href: string | null;
    label: string;
}) {
    if (!href) {
        return (
            <Button variant="outline" disabled>
                {label}
            </Button>
        );
    }
    return (
        <Button variant="outline" asChild>
            <Link href={href} preserveScroll>
                {label}
            </Link>
        </Button>
    );
}

function buildChips(filters: ProductFilters) {
    const chips: {
        key: string;
        label: string;
        clear: Partial<ProductFilters>;
    }[] = [];

    if (filters.category)
        chips.push({
            key: 'category',
            label: filters.category,
            clear: { category: '' },
        });
    if (filters.size)
        chips.push({
            key: 'size',
            label: `Size: ${filters.size}`,
            clear: { size: '' },
        });
    if (filters.color)
        chips.push({
            key: 'color',
            label: filters.color,
            clear: { color: '' },
        });
    if (filters.min)
        chips.push({
            key: 'min',
            label: `Min ৳${filters.min}`,
            clear: { min: null },
        });
    if (filters.max)
        chips.push({
            key: 'max',
            label: `Max ৳${filters.max}`,
            clear: { max: null },
        });
    if (filters.sale)
        chips.push({ key: 'sale', label: 'On sale', clear: { sale: false } });

    return chips;
}
