import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Ticket, Trash2 } from 'lucide-react';
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

type Coupon = {
    id: number;
    code: string;
    type: 'percent' | 'fixed';
    value: number;
    label: string;
    min_order_label: string | null;
    max_discount_label: string | null;
    usage_limit: number | null;
    used_count: number;
    expires_at: string | null;
    is_active: boolean;
};

type Props = {
    coupons: Coupon[];
};

type CouponForm = {
    code: string;
    type: 'percent' | 'fixed';
    value: string;
    min_order: string;
    max_discount: string;
    usage_limit: string;
    expires_at: string;
    is_active: boolean;
};

export default function CouponsIndex({ coupons }: Props) {
    const form = useForm<CouponForm>({
        code: '',
        type: 'percent',
        value: '',
        min_order: '',
        max_discount: '',
        usage_limit: '',
        expires_at: '',
        is_active: true,
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        form.post('/admin/coupons', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    function toggle(coupon: Coupon) {
        router.patch(
            `/admin/coupons/${coupon.id}`,
            { is_active: !coupon.is_active },
            { preserveScroll: true },
        );
    }

    function destroy(coupon: Coupon) {
        if (!window.confirm(`Delete coupon "${coupon.code}"?`)) {
            return;
        }
        router.delete(`/admin/coupons/${coupon.id}`, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Coupons" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Ticket className="size-5" />
                    </span>
                    <div>
                        <h1 className="font-display text-2xl font-semibold tracking-tight">
                            Coupons
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Create discount codes customers can apply at
                            checkout.
                        </p>
                    </div>
                </div>

                {/* Create form */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle>New coupon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    value={form.data.code}
                                    onChange={(e) =>
                                        form.setData(
                                            'code',
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                    placeholder="EID25"
                                    required
                                />
                                {form.errors.code && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.code}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label>Type</Label>
                                <Select
                                    value={form.data.type}
                                    onValueChange={(value) =>
                                        form.setData(
                                            'type',
                                            value as 'percent' | 'fixed',
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percent">
                                            Percentage (%)
                                        </SelectItem>
                                        <SelectItem value="fixed">
                                            Fixed amount (৳)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="value">
                                    {form.data.type === 'percent'
                                        ? 'Percent off'
                                        : 'Amount off (৳)'}
                                </Label>
                                <Input
                                    id="value"
                                    type="number"
                                    min="1"
                                    step={
                                        form.data.type === 'percent'
                                            ? '1'
                                            : '0.01'
                                    }
                                    max={
                                        form.data.type === 'percent'
                                            ? '100'
                                            : undefined
                                    }
                                    value={form.data.value}
                                    onChange={(e) =>
                                        form.setData('value', e.target.value)
                                    }
                                    required
                                />
                                {form.errors.value && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.value}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="min_order">
                                    Min. order (৳)
                                </Label>
                                <Input
                                    id="min_order"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Optional"
                                    value={form.data.min_order}
                                    onChange={(e) =>
                                        form.setData(
                                            'min_order',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            {form.data.type === 'percent' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="max_discount">
                                        Max. discount (৳)
                                    </Label>
                                    <Input
                                        id="max_discount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Optional cap"
                                        value={form.data.max_discount}
                                        onChange={(e) =>
                                            form.setData(
                                                'max_discount',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="usage_limit">Usage limit</Label>
                                <Input
                                    id="usage_limit"
                                    type="number"
                                    min="1"
                                    placeholder="Unlimited"
                                    value={form.data.usage_limit}
                                    onChange={(e) =>
                                        form.setData(
                                            'usage_limit',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="expires_at">Expires on</Label>
                                <Input
                                    id="expires_at"
                                    type="date"
                                    value={form.data.expires_at}
                                    onChange={(e) =>
                                        form.setData(
                                            'expires_at',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="flex items-end">
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                >
                                    <Plus className="size-4" />
                                    Create coupon
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* List */}
                <Card className="rounded-2xl">
                    <CardContent className="p-0">
                        {coupons.length === 0 ? (
                            <p className="py-12 text-center text-sm text-muted-foreground">
                                No coupons yet.
                            </p>
                        ) : (
                            <div className="flex flex-col divide-y">
                                {coupons.map((coupon) => (
                                    <div
                                        key={coupon.id}
                                        className="flex flex-wrap items-center gap-4 p-4"
                                    >
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-semibold tracking-wide">
                                                    {coupon.code}
                                                </span>
                                                <Badge variant="secondary">
                                                    {coupon.label}
                                                </Badge>
                                                {!coupon.is_active && (
                                                    <Badge variant="outline">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {coupon.min_order_label
                                                    ? `Min ${coupon.min_order_label} · `
                                                    : ''}
                                                {coupon.max_discount_label
                                                    ? `Cap ${coupon.max_discount_label} · `
                                                    : ''}
                                                Used {coupon.used_count}
                                                {coupon.usage_limit
                                                    ? ` / ${coupon.usage_limit}`
                                                    : ''}
                                                {coupon.expires_at
                                                    ? ` · Expires ${coupon.expires_at}`
                                                    : ''}
                                            </span>
                                        </div>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={coupon.is_active}
                                                onChange={() => toggle(coupon)}
                                                className="size-4 rounded border-input accent-primary"
                                            />
                                            Active
                                        </label>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => destroy(coupon)}
                                            aria-label="Delete coupon"
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
