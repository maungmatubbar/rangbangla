import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import shop from '@/routes/shop';

export function PromoBanner() {
    return (
        <section className="bg-brand-gradient relative isolate overflow-hidden rounded-3xl px-6 py-14 text-primary-foreground shadow-xl shadow-black/10 md:px-12 md:py-20">
            {/* Layered glows for depth. */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-white/20 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-28 -left-16 size-80 rounded-full bg-black/20 blur-3xl"
            />
            {/* Dotted texture overlay. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.14]"
            />
            {/* Inner highlight ring. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/15 ring-inset"
            />

            <div className="relative flex flex-col items-center gap-5 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-white uppercase backdrop-blur">
                    <Sparkles className="size-3.5" />
                    Eid Special
                </span>
                <h2 className="max-w-2xl font-display text-4xl font-semibold text-balance md:text-5xl">
                    Up to{' '}
                    <span className="relative whitespace-nowrap">
                        25% off
                        <span
                            aria-hidden
                            className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-white/60"
                        />
                    </span>{' '}
                    on festive favourites
                </h2>
                <p className="max-w-xl text-base text-primary-foreground/85">
                    Refresh your celebration wardrobe with our limited-time Eid
                    edit. Free delivery on orders over ৳3,000.
                </p>
                <Button
                    asChild
                    size="lg"
                    className="btn-sheen btn-lime mt-1 rounded-full"
                >
                    <Link
                        href={shop.products.index.url({ query: { sale: 1 } })}
                    >
                        Shop the sale
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
            </div>
        </section>
    );
}
