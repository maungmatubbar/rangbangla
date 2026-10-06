import { Head, router, useForm } from '@inertiajs/react';
import { Check, MapPin, Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { AccountShell } from '@/components/storefront/account/account-shell';
import account from '@/routes/account';
import { defaultMethod as makeDefaultAddress } from '@/routes/account/addresses';
import type { Address } from '@/types';

type Props = {
    addresses: Address[];
};

const empty = {
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postcode: '',
    is_default: false as boolean,
};

export default function Addresses({ addresses }: Props) {
    const [editing, setEditing] = useState<Address | null>(null);
    const [open, setOpen] = useState(false);

    const form = useForm({ ...empty });

    const startAdd = () => {
        form.setData({ ...empty });
        setEditing(null);
        setOpen(true);
    };

    const startEdit = (address: Address) => {
        form.setData({
            label: address.label ?? '',
            name: address.name,
            phone: address.phone,
            address: address.address,
            city: address.city,
            district: address.district,
            postcode: address.postcode ?? '',
            is_default: address.is_default,
        });
        setEditing(address);
        setOpen(true);
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const onSuccess = () => {
            setOpen(false);
            setEditing(null);
            form.reset();
        };

        if (editing) {
            form.put(account.addresses.update.url(editing.id), { onSuccess });
        } else {
            form.post(account.addresses.store.url(), { onSuccess });
        }
    };

    return (
        <>
            <Head title="Addresses" />
            <AccountShell
                active="addresses"
                title="Delivery addresses"
                description="Save addresses for faster checkout."
            >
                <div className="flex flex-col gap-6">
                    <div className="flex justify-end">
                        {!open && (
                            <Button onClick={startAdd} className="rounded-full">
                                <Plus className="size-4" />
                                Add address
                            </Button>
                        )}
                    </div>

                    {open && (
                        <Card className="rounded-2xl">
                            <CardContent>
                                <form
                                    onSubmit={submit}
                                    className="flex flex-col gap-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-semibold">
                                            {editing
                                                ? 'Edit address'
                                                : 'New address'}
                                        </h2>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setOpen(false)}
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field
                                            label="Label (optional)"
                                            error={form.errors.label}
                                        >
                                            <Input
                                                value={form.data.label}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'label',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Home, Office…"
                                            />
                                        </Field>
                                        <Field
                                            label="Full name"
                                            error={form.errors.name}
                                        >
                                            <Input
                                                value={form.data.name}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                        <Field
                                            label="Phone"
                                            error={form.errors.phone}
                                        >
                                            <Input
                                                value={form.data.phone}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="01XXXXXXXXX"
                                            />
                                        </Field>
                                        <Field
                                            label="Address"
                                            error={form.errors.address}
                                        >
                                            <Input
                                                value={form.data.address}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'address',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="House, road, area"
                                            />
                                        </Field>
                                        <Field
                                            label="City"
                                            error={form.errors.city}
                                        >
                                            <Input
                                                value={form.data.city}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'city',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                        <Field
                                            label="District"
                                            error={form.errors.district}
                                        >
                                            <Input
                                                value={form.data.district}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'district',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                        <Field
                                            label="Postcode (optional)"
                                            error={form.errors.postcode}
                                        >
                                            <Input
                                                value={form.data.postcode}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'postcode',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                    </div>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={form.data.is_default}
                                            onChange={(e) =>
                                                form.setData(
                                                    'is_default',
                                                    e.target.checked,
                                                )
                                            }
                                            className="size-4 accent-[var(--primary)]"
                                        />
                                        Set as default address
                                    </label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="submit"
                                            disabled={form.processing}
                                        >
                                            {editing
                                                ? 'Save changes'
                                                : 'Save address'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {addresses.length === 0 && !open ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
                            <MapPin className="size-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                                No saved addresses yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {addresses.map((address) => (
                                <Card key={address.id} className="rounded-2xl">
                                    <CardContent className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {address.label || address.name}
                                            </span>
                                            {address.is_default && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                    <Check className="size-3" />
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {address.name} · {address.phone}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {[
                                                address.address,
                                                address.city,
                                                address.district,
                                                address.postcode,
                                            ]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            {!address.is_default && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.patch(
                                                            makeDefaultAddress.url(
                                                                address.id,
                                                            ),
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <Star className="size-3.5" />
                                                    Make default
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    startEdit(address)
                                                }
                                            >
                                                <Pencil className="size-3.5" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-muted-foreground hover:text-destructive"
                                                onClick={() =>
                                                    router.delete(
                                                        account.addresses.destroy.url(
                                                            address.id,
                                                        ),
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                            >
                                                <Trash2 className="size-3.5" />
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </AccountShell>
        </>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}
