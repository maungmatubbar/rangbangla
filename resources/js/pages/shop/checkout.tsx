import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Banknote, Lock, ShieldCheck, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import shop from '@/routes/shop';
import type { Address, CartSummary } from '@/types';

type OtpFlash = {
    sent?: boolean;
    phone?: string;
    debug?: string | null;
} | null;

type Props = {
    cart: CartSummary;
    defaultAddress: Address | null;
    contact: { name: string | null; phone: string | null };
};

export default function Checkout({ cart, defaultAddress, contact }: Props) {
    const page = usePage().props as { flash?: { otp?: OtpFlash } };
    const otp = page.flash?.otp ?? null;

    const form = useForm({
        customer_name: contact.name ?? '',
        phone: contact.phone ?? '',
        address: defaultAddress?.address ?? '',
        city: defaultAddress?.city ?? '',
        district: defaultAddress?.district ?? '',
        postcode: defaultAddress?.postcode ?? '',
        payment_method: 'cod',
        shipping_note: '',
        otp: '',
    });

    const sendCode = () => {
        form.transform((data) => ({ phone: data.phone }));
        form.post(shop.checkout.otp.url(), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => form.transform((data) => data),
        });
    };

    const placeOrder = (event: React.FormEvent) => {
        event.preventDefault();
        form.post(shop.checkout.store.url());
    };

    return (
        <>
            <Head title="Checkout" />
            <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
                <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight">
                    Checkout
                </h1>

                <form
                    onSubmit={placeOrder}
                    className="grid gap-6 lg:grid-cols-3"
                >
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Section title="Contact details" step={1}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Full name"
                                    error={form.errors.customer_name}
                                >
                                    <Input
                                        value={form.data.customer_name}
                                        onChange={(e) =>
                                            form.setData(
                                                'customer_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. Ayesha Rahman"
                                        autoComplete="name"
                                    />
                                </Field>
                                <Field
                                    label="Phone number"
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
                                        autoComplete="tel"
                                    />
                                </Field>
                            </div>
                        </Section>

                        <Section title="Shipping address" step={2}>
                            <div className="grid gap-4">
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
                                        autoComplete="street-address"
                                    />
                                </Field>
                                <div className="grid gap-4 sm:grid-cols-3">
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
                                            placeholder="Dhaka"
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
                                            placeholder="Dhaka"
                                        />
                                    </Field>
                                    <Field
                                        label="Postcode"
                                        error={form.errors.postcode}
                                        optional
                                    >
                                        <Input
                                            value={form.data.postcode}
                                            onChange={(e) =>
                                                form.setData(
                                                    'postcode',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="1207"
                                        />
                                    </Field>
                                </div>
                                <Field
                                    label="Delivery note"
                                    error={form.errors.shipping_note}
                                    optional
                                >
                                    <Input
                                        value={form.data.shipping_note}
                                        onChange={(e) =>
                                            form.setData(
                                                'shipping_note',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Landmark, preferred time…"
                                    />
                                </Field>
                            </div>
                        </Section>

                        <Section title="Payment method" step={3}>
                            <div className="flex flex-col gap-3">
                                <PaymentOption
                                    selected={
                                        form.data.payment_method === 'cod'
                                    }
                                    onSelect={() =>
                                        form.setData('payment_method', 'cod')
                                    }
                                    icon={Banknote}
                                    title="Cash on Delivery"
                                    description="Pay with cash when your order arrives."
                                />
                                <PaymentOption
                                    disabled
                                    icon={Smartphone}
                                    title="bKash / Nagad"
                                    description="Online payment — coming soon."
                                />
                                <InputError
                                    message={form.errors.payment_method}
                                />
                            </div>
                        </Section>
                    </div>

                    {/* Summary + verification */}
                    <Card className="h-fit rounded-2xl lg:sticky lg:top-24">
                        <CardContent className="flex flex-col gap-4">
                            <h2 className="font-display text-xl font-semibold">
                                Your order
                            </h2>
                            <div className="flex flex-col gap-3">
                                {cart.lines.map((line) => (
                                    <div
                                        key={line.variant_id}
                                        className="flex items-center justify-between gap-3 text-sm"
                                    >
                                        <span className="flex-1">
                                            <span className="font-medium">
                                                {line.name}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {' '}
                                                × {line.quantity}
                                            </span>
                                            <span className="block text-xs text-muted-foreground">
                                                {line.variant_label}
                                            </span>
                                        </span>
                                        <span className="font-medium">
                                            {line.formatted_line_total}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Subtotal
                                </span>
                                <span>{cart.formatted_subtotal}</span>
                            </div>
                            {cart.coupon && cart.discount > 0 && (
                                <div className="flex items-center justify-between text-sm text-primary">
                                    <span>
                                        Coupon {cart.coupon.code} (
                                        {cart.coupon.label})
                                    </span>
                                    <span>−{cart.formatted_discount}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span>{cart.formatted_total}</span>
                            </div>

                            <Separator />

                            {/* OTP verification */}
                            {!otp?.sent ? (
                                <>
                                    <p className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                                        We'll text a code to your phone to
                                        confirm this order.
                                    </p>
                                    <Button
                                        type="button"
                                        size="lg"
                                        className="w-full rounded-full"
                                        onClick={sendCode}
                                        disabled={form.processing}
                                    >
                                        Send verification code
                                    </Button>
                                    <InputError message={form.errors.phone} />
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-1 text-sm">
                                        <span className="text-muted-foreground">
                                            Code sent to {otp.phone}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={sendCode}
                                            className="w-fit text-xs text-primary hover:underline"
                                        >
                                            Resend code
                                        </button>
                                    </div>
                                    {otp.debug && (
                                        <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-sm">
                                            Dev code:{' '}
                                            <span className="font-semibold tracking-widest">
                                                {otp.debug}
                                            </span>
                                        </div>
                                    )}
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="otp">
                                            Verification code
                                        </Label>
                                        <Input
                                            id="otp"
                                            value={form.data.otp}
                                            onChange={(e) =>
                                                form.setData(
                                                    'otp',
                                                    e.target.value,
                                                )
                                            }
                                            inputMode="numeric"
                                            maxLength={6}
                                            placeholder="••••••"
                                            className="text-center text-lg tracking-[0.5em]"
                                        />
                                        <InputError message={form.errors.otp} />
                                    </div>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full rounded-full"
                                        disabled={form.processing}
                                    >
                                        <Lock className="size-4" />
                                        Place order
                                    </Button>
                                </>
                            )}

                            <Button variant="ghost" asChild className="w-full">
                                <Link href={shop.cart.show()}>
                                    Back to cart
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}

function Section({
    title,
    step,
    children,
}: {
    title: string;
    step: number;
    children: React.ReactNode;
}) {
    return (
        <Card className="rounded-2xl">
            <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {step}
                    </span>
                    <h2 className="font-display text-lg font-semibold">
                        {title}
                    </h2>
                </div>
                {children}
            </CardContent>
        </Card>
    );
}

function Field({
    label,
    error,
    optional,
    children,
}: {
    label: string;
    error?: string;
    optional?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label className="text-sm">
                {label}
                {optional && (
                    <span className="ml-1 text-xs text-muted-foreground">
                        (optional)
                    </span>
                )}
            </Label>
            {children}
            <InputError message={error} />
        </div>
    );
}

function PaymentOption({
    selected,
    onSelect,
    disabled,
    icon: Icon,
    title,
    description,
}: {
    selected?: boolean;
    onSelect?: () => void;
    disabled?: boolean;
    icon: typeof Banknote;
    title: string;
    description: string;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            disabled={disabled}
            className={cn(
                'flex items-center gap-3 rounded-xl border p-4 text-left transition-colors',
                selected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'hover:border-primary/60',
                disabled && 'cursor-not-allowed opacity-50',
            )}
        >
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon className="size-5" />
            </span>
            <span className="flex-1">
                <span className="block font-medium">{title}</span>
                <span className="block text-sm text-muted-foreground">
                    {description}
                </span>
            </span>
            <span
                className={cn(
                    'size-4 rounded-full border',
                    selected && 'border-4 border-primary',
                )}
            />
        </button>
    );
}
