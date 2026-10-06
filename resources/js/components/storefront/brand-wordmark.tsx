import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
    /** Render light text for use on dark / gradient backgrounds. */
    inverted?: boolean;
};

export function BrandWordmark({ className, inverted = false }: Props) {
    return (
        <Link
            href={home()}
            className={cn('group flex flex-col leading-none', className)}
            aria-label="Rangbangla home"
        >
            <span className="text-brand font-sans text-[0.6rem] font-medium tracking-[0.35em] uppercase">
                রংবাংলা
            </span>
            <span
                className={cn(
                    'brand-animated font-display text-xl font-semibold tracking-tight',
                    inverted && 'drop-shadow-sm',
                )}
            >
                Rangbangla<span aria-hidden>.</span>
            </span>
        </Link>
    );
}
