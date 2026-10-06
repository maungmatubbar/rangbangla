import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { cn } from '@/lib/utils';

type Props = {
    eyebrow?: string;
    title: string;
    description?: string;
    viewAllHref?: NonNullable<InertiaLinkProps['href']>;
    viewAllLabel?: string;
    align?: 'left' | 'center';
    className?: string;
};

export function SectionHeading({
    eyebrow,
    title,
    description,
    viewAllHref,
    viewAllLabel = 'View all',
    align = 'left',
    className,
}: Props) {
    return (
        <div
            className={cn(
                'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
                align === 'center' &&
                    'sm:flex-col sm:items-center sm:text-center',
                className,
            )}
        >
            <div
                className={cn(
                    'flex flex-col gap-1',
                    align === 'center' && 'items-center',
                )}
            >
                {eyebrow && (
                    <span className="text-foreground/70 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
                        <span className="bg-lime h-0.5 w-6 rounded-full" />
                        {eyebrow}
                    </span>
                )}
                <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                    {title}
                </h2>
                {description && (
                    <p className="max-w-xl text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {viewAllHref && (
                <Link
                    href={viewAllHref}
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                >
                    {viewAllLabel}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            )}
        </div>
    );
}
