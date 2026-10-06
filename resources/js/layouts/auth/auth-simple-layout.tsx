import { Link } from '@inertiajs/react';
import { BadgeCheck, ShieldCheck, Truck } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const perks = [
    { icon: Truck, text: 'Nationwide cash-on-delivery' },
    { icon: BadgeCheck, text: '100% authentic handloom craft' },
    { icon: ShieldCheck, text: 'Secure phone-OTP login' },
];

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* Brand panel */}
            <div className="bg-brand-gradient relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-14">
                <div className="bg-lime pointer-events-none absolute -top-24 -right-20 size-96 rounded-full opacity-25 blur-3xl" />
                <div className="bg-lime pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full opacity-15 blur-3xl" />

                <Link
                    href={home()}
                    className="relative flex flex-col leading-none"
                >
                    <span className="text-lime font-sans text-xs font-medium tracking-[0.35em] uppercase">
                        রংবাংলা
                    </span>
                    <span className="font-display text-4xl font-semibold tracking-tight text-white">
                        Rangbangla.
                    </span>
                </Link>

                <div className="relative flex flex-col gap-4">
                    <h2 className="max-w-md font-display text-4xl leading-tight font-semibold text-balance">
                        Wear the colour of Bengal.
                    </h2>
                    <p className="max-w-sm text-white/85">
                        Handwoven sarees, festive panjabi and everyday ethnic
                        wear — crafted by local artisans, delivered to your
                        door.
                    </p>
                </div>

                <ul className="relative flex flex-col gap-3">
                    {perks.map(({ icon: Icon, text }) => (
                        <li
                            key={text}
                            className="flex items-center gap-3 text-sm"
                        >
                            <span className="bg-lime/15 flex size-9 items-center justify-center rounded-full backdrop-blur">
                                <Icon className="text-lime size-4" />
                            </span>
                            {text}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Form side */}
            <div className="flex items-center justify-center bg-background p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex flex-col gap-3">
                        <Link
                            href={home()}
                            className="flex w-fit flex-col leading-none lg:hidden"
                        >
                            <span className="font-sans text-[0.6rem] font-medium tracking-[0.35em] text-brand uppercase">
                                রংবাংলা
                            </span>
                            <span className="brand-animated font-display text-2xl font-semibold tracking-tight">
                                Rangbangla.
                            </span>
                        </Link>

                        <div className="flex flex-col gap-1">
                            <h1 className="font-display text-2xl font-semibold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
