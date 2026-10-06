import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Mail, Smartphone } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { login as loginRoute, register } from '@/routes';
import { login as phoneLogin, otp as phoneOtp } from '@/routes/auth/phone';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type OtpFlash = {
    sent?: boolean;
    phone?: string;
    is_new?: boolean;
    debug?: string | null;
} | null;

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const page = usePage().props as { flash?: { otp?: OtpFlash } };
    const otp = page.flash?.otp ?? null;
    const [tab, setTab] = useState<'phone' | 'email'>('phone');

    const onOtpStep = tab === 'phone' && otp?.sent;

    return (
        <>
            <Head title="Log in" />

            {!onOtpStep && (
                <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                    <TabButton
                        active={tab === 'phone'}
                        onClick={() => setTab('phone')}
                        icon={<Smartphone className="size-4" />}
                        label="Phone"
                    />
                    <TabButton
                        active={tab === 'email'}
                        onClick={() => setTab('email')}
                        icon={<Mail className="size-4" />}
                        label="Email"
                    />
                </div>
            )}

            {tab === 'phone' ? (
                otp?.sent ? (
                    <Form
                        {...phoneLogin.form()}
                        resetOnSuccess={['code']}
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <input
                                    type="hidden"
                                    name="phone"
                                    value={otp.phone ?? ''}
                                />
                                <div className="flex flex-col gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        We sent a 6-digit code to
                                    </span>
                                    <span className="font-medium">
                                        {otp.phone}{' '}
                                        <Link
                                            href={loginRoute()}
                                            className="ml-1 text-xs text-primary hover:underline"
                                        >
                                            change
                                        </Link>
                                    </span>
                                </div>

                                {otp.debug && (
                                    <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-sm">
                                        Dev mode — your code is{' '}
                                        <span className="font-semibold tracking-widest">
                                            {otp.debug}
                                        </span>
                                    </div>
                                )}

                                {otp.is_new && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Your name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            autoFocus
                                            placeholder="e.g. Ayesha Rahman"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="code">
                                        Verification code
                                    </Label>
                                    <Input
                                        id="code"
                                        name="code"
                                        required
                                        autoFocus={!otp.is_new}
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="••••••"
                                        className="text-center text-lg tracking-[0.5em]"
                                    />
                                    <InputError message={errors.code} />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Verify & continue
                                </Button>
                            </>
                        )}
                    </Form>
                ) : (
                    <Form {...phoneOtp.form()} className="flex flex-col gap-6">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        autoFocus
                                        autoComplete="tel"
                                        placeholder="01712345678"
                                    />
                                    <InputError message={errors.phone} />
                                    <p className="text-xs text-muted-foreground">
                                        We'll text you a one-time code to log in
                                        or create your account.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Send verification code
                                </Button>
                            </>
                        )}
                    </Form>
                )
            ) : (
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </>
                    )}
                </Form>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
                New to Rangbangla?{' '}
                <TextLink href={register()}>Create an account</TextLink>
            </div>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

function TabButton({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors',
                active
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
            )}
        >
            {icon}
            {label}
        </button>
    );
}

Login.layout = {
    title: 'Welcome back',
    description: 'Log in with your phone number or email',
};
