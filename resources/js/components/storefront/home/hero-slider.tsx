import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import shop from '@/routes/shop';

type Slide = {
    image: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: { label: string; href: string };
};

const img = (id: string) =>
    `https://images.unsplash.com/photo-${id}?w=1600&h=1000&fit=crop&crop=faces,center&q=80&auto=format`;

const slides: Slide[] = [
    {
        image: img('1628477116196-48afe0d209e0'),
        eyebrow: 'The 2026 Collection',
        title: 'Woven in Bengal, worn with pride',
        subtitle:
            'Handloom sarees and heritage ethnic wear — the colour of Bengal, tailored for the modern wardrobe.',
        cta: { label: 'Shop the collection', href: shop.products.index.url() },
    },
    {
        image: img('1727835523545-70ee992b5763'),
        eyebrow: "The Men's Edit",
        title: 'The art of the panjabi',
        subtitle:
            'Pure cotton and silk, cut with precision for Eid and every celebration in between.',
        cta: {
            label: 'Shop menswear',
            href: shop.products.index.url({ query: { category: 'Panjabi' } }),
        },
    },
    {
        image: img('1622207691293-5cd80466dab3'),
        eyebrow: 'The Festive Edit',
        title: 'Dressed for every occasion',
        subtitle:
            'A curated edit of our most-loved festive pieces, up to 25% off. Free delivery over ৳3,000.',
        cta: {
            label: 'Shop the edit',
            href: shop.products.index.url({ query: { sale: 1 } }),
        },
    },
];

export function HeroSlider() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);

    const go = useCallback(
        (next: number) => setActive((next + slides.length) % slides.length),
        [],
    );

    useEffect(() => {
        if (paused) return;
        timer.current = setInterval(
            () => setActive((a) => (a + 1) % slides.length),
            6000,
        );
        return () => {
            if (timer.current) clearInterval(timer.current);
        };
    }, [paused, active]);

    return (
        <section
            className="relative h-[440px] w-full overflow-hidden rounded-2xl bg-neutral-900 lg:h-[500px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
        >
            {slides.map((slide, index) => (
                <div
                    key={slide.title}
                    className={cn(
                        'absolute inset-0 transition-opacity duration-700 ease-out',
                        index === active
                            ? 'z-10 opacity-100'
                            : 'pointer-events-none z-0 opacity-0',
                    )}
                    aria-hidden={index !== active}
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src={slide.image}
                            alt=""
                            className={cn(
                                'size-full object-cover',
                                index === active && 'animate-kenburns',
                            )}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 md:px-8">
                        {index === active && (
                            <div
                                key={active}
                                className="flex max-w-xl flex-col items-start gap-5 text-white"
                            >
                                <span className="inline-flex animate-in items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.25em] text-white uppercase backdrop-blur duration-500 fade-in slide-in-from-bottom-2">
                                    <span className="size-1.5 rounded-full bg-lime" />
                                    {slide.eyebrow}
                                </span>
                                <h1 className="animate-in font-display text-5xl leading-[1.05] font-semibold tracking-tight text-balance duration-700 fade-in slide-in-from-bottom-4 md:text-7xl">
                                    {slide.title}
                                </h1>
                                <p className="max-w-md animate-in text-base text-white/85 duration-700 fade-in slide-in-from-bottom-4 md:text-lg">
                                    {slide.subtitle}
                                </p>
                                <div className="flex animate-in flex-wrap items-center gap-3 pt-1 duration-1000 fade-in slide-in-from-bottom-4">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="btn-sheen btn-lime rounded-full"
                                    >
                                        <Link href={slide.cta.href}>
                                            {slide.cta.label}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                    >
                                        <Link
                                            href={shop.products.index.url({
                                                query: { sort: 'newest' },
                                            })}
                                        >
                                            New arrivals
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Arrows */}
            <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous slide"
                className="absolute top-1/2 left-4 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 p-2.5 text-white backdrop-blur transition-colors hover:bg-black/40 md:inline-flex"
            >
                <ChevronLeft className="size-5" />
            </button>
            <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next slide"
                className="absolute top-1/2 right-4 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 p-2.5 text-white backdrop-blur transition-colors hover:bg-black/40 md:inline-flex"
            >
                <ChevronRight className="size-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                {slides.map((slide, index) => (
                    <button
                        key={slide.title}
                        type="button"
                        onClick={() => go(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={cn(
                            'h-1.5 rounded-full transition-all',
                            index === active
                                ? 'w-8 bg-primary'
                                : 'w-2.5 bg-white/50 hover:bg-white/80',
                        )}
                    />
                ))}
            </div>
        </section>
    );
}
