import { Leaf, Scissors, Sparkles } from 'lucide-react';

const pillars = [
    {
        icon: Scissors,
        title: 'Handloom heritage',
        body: 'Every weave is crafted on traditional looms by artisan families across Bengal.',
    },
    {
        icon: Leaf,
        title: 'Natural fabrics',
        body: 'Breathable cotton, pure silk and half-silk — kind to your skin and the craft.',
    },
    {
        icon: Sparkles,
        title: 'Festive ready',
        body: 'Curated colours and detailing designed for Eid, Pohela Boishakh and weddings.',
    },
];

export function BrandStory() {
    return (
        <section className="relative grid gap-10 overflow-hidden rounded-3xl bg-secondary/50 p-8 md:p-12 lg:grid-cols-2 lg:items-center">
            {/* Soft lime glow for depth. */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-lime opacity-25 blur-3xl"
            />

            <div className="relative flex flex-col gap-4">
                <span className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.2em] uppercase">
                    <span className="h-0.5 w-8 rounded-full bg-lime" />
                    <span className="text-foreground/70">Our Story</span>
                </span>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                    Woven in Bengal, worn with pride
                </h2>
                <p className="max-w-prose text-muted-foreground">
                    Rangbangla began with a simple belief — that the colour and
                    craft of Bengal deserve a place in every wardrobe. We work
                    directly with handloom weavers and karigars, bringing you
                    authentic ethnic wear without the middlemen, delivered to
                    your doorstep across Bangladesh.
                </p>
            </div>

            <div className="relative grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {pillars.map(({ icon: Icon, title, body }) => (
                    <div
                        key={title}
                        className="group flex flex-col gap-2 rounded-2xl border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-lg"
                    >
                        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-lime text-lime-ink shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                            <Icon className="size-5" />
                        </span>
                        <h3 className="font-medium">{title}</h3>
                        <p className="text-sm text-muted-foreground">{body}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
