import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorSwatch } from '@/components/storefront/color-swatch';
import { cn } from '@/lib/utils';
import type { ProductColor, ProductFilters } from '@/types';

type Props = {
    filters: ProductFilters;
    categories: string[];
    sizes: string[];
    colors: ProductColor[];
    onChange: (patch: Partial<ProductFilters>) => void;
    onClear: () => void;
};

export function ShopFilters({
    filters,
    categories,
    sizes,
    colors,
    onChange,
    onClear,
}: Props) {
    const [min, setMin] = useState(filters.min ?? '');
    const [max, setMax] = useState(filters.max ?? '');

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide uppercase">
                    Filters
                </h2>
                <button
                    type="button"
                    onClick={onClear}
                    className="text-xs text-muted-foreground hover:text-primary"
                >
                    Clear all
                </button>
            </div>

            {/* Category */}
            <FilterGroup label="Category">
                <div className="flex flex-col gap-1">
                    <CategoryRow
                        label="All categories"
                        active={filters.category === ''}
                        onClick={() => onChange({ category: '' })}
                    />
                    {categories.map((category) => (
                        <CategoryRow
                            key={category}
                            label={category}
                            active={filters.category === category}
                            onClick={() => onChange({ category })}
                        />
                    ))}
                </div>
            </FilterGroup>

            {/* Size */}
            {sizes.length > 0 && (
                <FilterGroup label="Size">
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() =>
                                    onChange({
                                        size: filters.size === size ? '' : size,
                                    })
                                }
                                className={cn(
                                    'min-w-10 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors',
                                    filters.size === size
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-input hover:border-primary',
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </FilterGroup>
            )}

            {/* Color */}
            {colors.length > 0 && (
                <FilterGroup label="Colour">
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <ColorSwatch
                                key={color.color}
                                color={color.color}
                                hex={color.color_hex}
                                selected={filters.color === color.color}
                                onClick={() =>
                                    onChange({
                                        color:
                                            filters.color === color.color
                                                ? ''
                                                : color.color,
                                    })
                                }
                            />
                        ))}
                    </div>
                </FilterGroup>
            )}

            {/* Price */}
            <FilterGroup label="Price (৳)">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <Label
                            htmlFor="price-min"
                            className="text-xs text-muted-foreground"
                        >
                            Min
                        </Label>
                        <Input
                            id="price-min"
                            type="number"
                            inputMode="numeric"
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
                            placeholder="0"
                            className="h-9"
                        />
                    </div>
                    <div className="flex-1">
                        <Label
                            htmlFor="price-max"
                            className="text-xs text-muted-foreground"
                        >
                            Max
                        </Label>
                        <Input
                            id="price-max"
                            type="number"
                            inputMode="numeric"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                            placeholder="10000"
                            className="h-9"
                        />
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() =>
                        onChange({ min: min || null, max: max || null })
                    }
                >
                    Apply price
                </Button>
            </FilterGroup>

            {/* Sale */}
            <label className="flex cursor-pointer items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium">On sale only</span>
                <input
                    type="checkbox"
                    checked={filters.sale}
                    onChange={(e) => onChange({ sale: e.target.checked })}
                    className="size-4 accent-[var(--primary)]"
                />
            </label>
        </div>
    );
}

function FilterGroup({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-3 border-t pt-4 first:border-t-0 first:pt-0">
            <h3 className="text-sm font-medium">{label}</h3>
            {children}
        </div>
    );
}

function CategoryRow({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                active
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
        >
            {label}
        </button>
    );
}
