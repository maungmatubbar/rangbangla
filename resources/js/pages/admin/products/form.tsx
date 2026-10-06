import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Star, Trash2, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';

type ProductImage = {
    id: number;
    url: string;
    is_primary: boolean;
    position: number;
};

type ProductVariant = {
    id: number;
    size: string | null;
    color: string | null;
    color_hex: string | null;
    sku: string | null;
    price: number | null;
    formatted_price: string;
    stock: number;
    is_active: boolean;
};

type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    formatted_price: string;
    compare_at_price: number | null;
    discount_percent: number;
    sale_price: number;
    formatted_sale_price: string;
    category: string | null;
    sku: string | null;
    is_active: boolean;
    is_featured: boolean;
    total_stock: number;
    images: ProductImage[];
    variants: ProductVariant[];
};

type Options = {
    categories: string[];
    sizes: string[];
    colors: { color: string; color_hex: string | null }[];
};

type Props = {
    product: Product | null;
    options: Options;
};

const NONE = '__none__';

type DetailsForm = {
    name: string;
    description: string;
    price: string;
    compare_at_price: string;
    discount_percent: string;
    category: string;
    sku: string;
    is_active: boolean;
    is_featured: boolean;
};

export default function ProductForm({ product, options }: Props) {
    const editing = product !== null;

    const form = useForm<DetailsForm>({
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product ? String(product.price) : '',
        compare_at_price:
            product?.compare_at_price != null
                ? String(product.compare_at_price)
                : '',
        discount_percent: product?.discount_percent
            ? String(product.discount_percent)
            : '',
        category: product?.category ?? '',
        sku: product?.sku ?? '',
        is_active: product?.is_active ?? true,
        is_featured: product?.is_featured ?? false,
    });

    function submitDetails(event: React.FormEvent) {
        event.preventDefault();
        if (product) {
            form.put(admin.products.update.url(product.id), {
                preserveScroll: true,
            });
        } else {
            form.post(admin.products.store.url());
        }
    }

    return (
        <>
            <Head title={editing ? 'Edit product' : 'New product'} />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <Link
                        href={admin.products.index.url()}
                        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to products
                    </Link>
                    <h1 className="font-display text-2xl font-semibold tracking-tight">
                        {editing ? 'Edit product' : 'New product'}
                    </h1>
                </div>

                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submitDetails}
                            className="flex flex-col gap-5"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    required
                                />
                                {form.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) =>
                                        form.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                />
                                {form.errors.description && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-5 sm:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price (৳)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.data.price}
                                        onChange={(e) =>
                                            form.setData(
                                                'price',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {form.errors.price && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.price}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="compare_at_price">
                                        Compare at price (৳)
                                    </Label>
                                    <Input
                                        id="compare_at_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.data.compare_at_price}
                                        onChange={(e) =>
                                            form.setData(
                                                'compare_at_price',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {form.errors.compare_at_price && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.compare_at_price}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="discount_percent">
                                        Discount (%)
                                    </Label>
                                    <Input
                                        id="discount_percent"
                                        type="number"
                                        step="1"
                                        min="0"
                                        max="90"
                                        placeholder="0"
                                        value={form.data.discount_percent}
                                        onChange={(e) =>
                                            form.setData(
                                                'discount_percent',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {form.errors.discount_percent ? (
                                        <p className="text-sm text-destructive">
                                            {form.errors.discount_percent}
                                        </p>
                                    ) : (
                                        <SalePriceHint
                                            price={form.data.price}
                                            percent={form.data.discount_percent}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={form.data.category || NONE}
                                        onValueChange={(value) =>
                                            form.setData(
                                                'category',
                                                value === NONE ? '' : value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>
                                                Uncategorised
                                            </SelectItem>
                                            {options.categories.map((cat) => (
                                                <SelectItem
                                                    key={cat}
                                                    value={cat}
                                                >
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.errors.category && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.category}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        value={form.data.sku}
                                        onChange={(e) =>
                                            form.setData('sku', e.target.value)
                                        }
                                    />
                                    {form.errors.sku && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.sku}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_active}
                                        onChange={(e) =>
                                            form.setData(
                                                'is_active',
                                                e.target.checked,
                                            )
                                        }
                                        className="size-4 rounded border-input accent-primary"
                                    />
                                    Active
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_featured}
                                        onChange={(e) =>
                                            form.setData(
                                                'is_featured',
                                                e.target.checked,
                                            )
                                        }
                                        className="size-4 rounded border-input accent-primary"
                                    />
                                    Featured
                                </label>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                >
                                    {editing
                                        ? 'Save changes'
                                        : 'Create product'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {product && (
                    <>
                        <ImagesCard product={product} />
                        <VariantsCard product={product} options={options} />
                    </>
                )}
            </div>
        </>
    );
}

function SalePriceHint({ price, percent }: { price: string; percent: string }) {
    const base = parseFloat(price);
    const pct = parseInt(percent, 10);

    if (!base || !pct || pct <= 0) {
        return (
            <p className="text-xs text-muted-foreground">
                Leave empty for no markdown.
            </p>
        );
    }

    const sale = Math.round(base * (100 - pct)) / 100;

    return (
        <p className="text-xs text-primary">
            Sells for ৳{sale.toLocaleString()} ({pct}% off)
        </p>
    );
}

function ImagesCard({ product }: { product: Product }) {
    const imageForm = useForm<{ image: File | null }>({ image: null });

    function upload(event: React.FormEvent) {
        event.preventDefault();
        imageForm.post(admin.products.images.store.url(product.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => imageForm.reset(),
        });
    }

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                {product.images.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No images uploaded yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {product.images.map((image) => (
                            <div
                                key={image.id}
                                className="group relative overflow-hidden rounded-xl border"
                            >
                                <img
                                    src={image.url}
                                    alt=""
                                    className="aspect-square w-full object-cover"
                                />
                                {image.is_primary && (
                                    <Badge className="absolute top-2 left-2">
                                        Primary
                                    </Badge>
                                )}
                                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/50 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                    {!image.is_primary && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            onClick={() =>
                                                router.patch(
                                                    admin.products.images.primary.url(
                                                        {
                                                            product: product.id,
                                                            image: image.id,
                                                        },
                                                    ),
                                                    {},
                                                    { preserveScroll: true },
                                                )
                                            }
                                        >
                                            <Star className="size-3.5" />
                                            Set primary
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="ml-auto size-7"
                                        onClick={() =>
                                            router.delete(
                                                admin.products.images.destroy.url(
                                                    {
                                                        product: product.id,
                                                        image: image.id,
                                                    },
                                                ),
                                                { preserveScroll: true },
                                            )
                                        }
                                    >
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <form
                    onSubmit={upload}
                    className="flex flex-wrap items-center gap-3"
                >
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            imageForm.setData(
                                'image',
                                e.target.files?.[0] ?? null,
                            )
                        }
                        className="max-w-xs"
                    />
                    <Button
                        type="submit"
                        disabled={
                            imageForm.processing ||
                            imageForm.data.image === null
                        }
                    >
                        <Upload className="size-4" />
                        Upload
                    </Button>
                    {imageForm.errors.image && (
                        <p className="text-sm text-destructive">
                            {imageForm.errors.image}
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

function VariantsCard({
    product,
    options,
}: {
    product: Product;
    options: Options;
}) {
    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                {product.variants.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No variants yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {product.variants.map((variant) => (
                            <VariantRow
                                key={variant.id}
                                product={product}
                                variant={variant}
                            />
                        ))}
                    </div>
                )}

                <AddVariant product={product} options={options} />
            </CardContent>
        </Card>
    );
}

function VariantRow({
    product,
    variant,
}: {
    product: Product;
    variant: ProductVariant;
}) {
    const form = useForm({
        size: variant.size ?? '',
        color: variant.color ?? '',
        color_hex: variant.color_hex ?? '',
        price: variant.price != null ? String(variant.price) : '',
        stock: String(variant.stock),
        is_active: variant.is_active,
    });

    function save() {
        form.put(
            admin.products.variants.update.url({
                product: product.id,
                variant: variant.id,
            }),
            { preserveScroll: true },
        );
    }

    function destroy() {
        if (!window.confirm('Delete this variant?')) {
            return;
        }
        router.delete(
            admin.products.variants.destroy.url({
                product: product.id,
                variant: variant.id,
            }),
            { preserveScroll: true },
        );
    }

    return (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border p-3">
            <div className="flex items-center gap-2">
                {variant.color_hex && (
                    <span
                        className="size-6 shrink-0 rounded-full border"
                        style={{ backgroundColor: variant.color_hex }}
                    />
                )}
                <div className="flex flex-col">
                    <span className="text-sm font-medium">
                        {variant.size ?? '—'}
                        {variant.color ? ` · ${variant.color}` : ''}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {variant.sku ?? 'No SKU'} · {variant.formatted_price}
                    </span>
                </div>
            </div>

            <div className="grid gap-1">
                <Label className="text-xs">Stock</Label>
                <Input
                    type="number"
                    min="0"
                    value={form.data.stock}
                    onChange={(e) => form.setData('stock', e.target.value)}
                    className="h-9 w-24"
                />
            </div>

            <label className="flex items-center gap-2 pb-2 text-sm">
                <input
                    type="checkbox"
                    checked={form.data.is_active}
                    onChange={(e) =>
                        form.setData('is_active', e.target.checked)
                    }
                    className="size-4 rounded border-input accent-primary"
                />
                Active
            </label>

            <div className="ml-auto flex items-center gap-2">
                <Button
                    type="button"
                    size="sm"
                    onClick={save}
                    disabled={form.processing}
                >
                    Save
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={destroy}
                >
                    <Trash2 className="size-4 text-destructive" />
                </Button>
            </div>
        </div>
    );
}

const VARIANT_NONE = '__none__';

function AddVariant({
    product,
    options,
}: {
    product: Product;
    options: Options;
}) {
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [colorHex, setColorHex] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('0');
    const [processing, setProcessing] = useState(false);

    function add(event: React.FormEvent) {
        event.preventDefault();
        setProcessing(true);
        router.post(
            admin.products.variants.store.url(product.id),
            {
                size: size || null,
                color: color || null,
                color_hex: colorHex || null,
                price: price !== '' ? price : null,
                stock,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    setSize('');
                    setColor('');
                    setColorHex('');
                    setPrice('');
                    setStock('0');
                },
            },
        );
    }

    return (
        <form
            onSubmit={add}
            className="flex flex-wrap items-end gap-3 border-t pt-5"
        >
            <div className="grid gap-1">
                <Label className="text-xs">Size</Label>
                <Select
                    value={size || VARIANT_NONE}
                    onValueChange={(value) =>
                        setSize(value === VARIANT_NONE ? '' : value)
                    }
                >
                    <SelectTrigger className="h-9 w-28">
                        <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={VARIANT_NONE}>None</SelectItem>
                        {options.sizes.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-1">
                <Label className="text-xs">Colour</Label>
                <Select
                    value={color || VARIANT_NONE}
                    onValueChange={(value) => {
                        if (value === VARIANT_NONE) {
                            setColor('');
                            setColorHex('');
                            return;
                        }
                        setColor(value);
                        const match = options.colors.find(
                            (c) => c.color === value,
                        );
                        setColorHex(match?.color_hex ?? '');
                    }}
                >
                    <SelectTrigger className="h-9 w-36">
                        <SelectValue placeholder="Colour" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={VARIANT_NONE}>None</SelectItem>
                        {options.colors.map((c) => (
                            <SelectItem key={c.color} value={c.color}>
                                <span className="flex items-center gap-2">
                                    {c.color_hex && (
                                        <span
                                            className={cn(
                                                'size-3 rounded-full border',
                                            )}
                                            style={{
                                                backgroundColor: c.color_hex,
                                            }}
                                        />
                                    )}
                                    {c.color}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-1">
                <Label className="text-xs">Price (৳)</Label>
                <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="h-9 w-28"
                    placeholder="Default"
                />
            </div>

            <div className="grid gap-1">
                <Label className="text-xs">Stock</Label>
                <Input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="h-9 w-24"
                />
            </div>

            <Button type="submit" size="sm" disabled={processing}>
                Add variant
            </Button>
        </form>
    );
}
