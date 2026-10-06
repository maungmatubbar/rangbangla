import { cn } from '@/lib/utils';

type Props = {
    eyebrow: string;
    title: string;
    description?: string;
    /** When provided, renders a full-bleed image band with a maroon overlay. */
    image?: string;
    align?: 'left' | 'center';
};

/**
 * Editorial page header used across the About / Contact / Privacy pages.
 * With an `image` it becomes a full-bleed hero band; without one it renders
 * a calm, spacious masthead on the ivory canvas.
 */
export function PageHero({
    eyebrow,
    title,
    description,
    image,
    align = 'left',
}: Props) {
    const Eyebrow = (
        <span className="text-brand inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase">
            <span className="h-0.5 w-6 rounded-full bg-lime" />
            {eyebrow}
        </span>
    );

    if (image) {
        return (
            <section className="relative isolate overflow-hidden bg-neutral-900">
                <img
                    src={image}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
                <div className="bg-brand-gradient absolute inset-0 opacity-25 mix-blend-multiply" />
                <div
                    className={cn(
                        'relative mx-auto flex max-w-7xl flex-col gap-5 px-4 py-20 text-white md:px-6 md:py-28',
                        align === 'center' && 'items-center text-center',
                    )}
                >
                    {Eyebrow}
                    <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="max-w-xl text-base text-white/85 md:text-lg">
                            {description}
                        </p>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section className="border-b bg-secondary/40">
            <div
                className={cn(
                    'mx-auto flex max-w-7xl flex-col gap-4 px-4 py-14 md:px-6 md:py-20',
                    align === 'center' && 'items-center text-center',
                )}
            >
                {Eyebrow}
                <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                    {title}
                </h1>
                {description && (
                    <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                        {description}
                    </p>
                )}
            </div>
        </section>
    );
}
