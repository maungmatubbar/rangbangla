import { Head, Link } from '@inertiajs/react';
import {
    HandHeart,
    Leaf,
    Scissors,
    Sparkles,
    Truck,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/storefront/page-hero';
import { Reveal } from '@/components/storefront/reveal';
import { SectionHeading } from '@/components/storefront/section-heading';
import shop from '@/routes/shop';

const img = (id: string, w = 900, h = 1100) =>
    `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=faces,center&q=80&auto=format`;

const stats = [
    { value: '500+', label: 'Artisan families' },
    { value: '50,000+', label: 'Orders delivered' },
    { value: '64', label: 'Districts reached' },
    { value: '4.9/5', label: 'Customer rating' },
];

const values = [
    {
        icon: Scissors,
        title: 'Handloom heritage',
        body: 'Every weave is crafted on traditional looms by artisan families across Bengal — skills passed down through generations.',
    },
    {
        icon: Leaf,
        title: 'Natural fabrics',
        body: 'Breathable cotton, pure silk and half-silk — kind to your skin, honest to the craft and built to last.',
    },
    {
        icon: HandHeart,
        title: 'Fair & direct',
        body: 'We buy straight from the weavers — no middlemen — so makers earn fairly and you pay an honest price.',
    },
    {
        icon: Sparkles,
        title: 'Festive ready',
        body: 'Curated colours and detailing designed for Eid, Pohela Boishakh, Puja and weddings.',
    },
];

export default function About() {
    return (
        <>
            <Head title="About Us" />

            <PageHero
                eyebrow="Our Story"
                title="Woven in Bengal, worn with pride"
                description="Rangbangla brings the colour and craft of Bengal to your wardrobe — authentic ethnic wear, made by local artisans and delivered across Bangladesh."
                image={img('1610030469983-98e550d6193c', 1600, 900)}
            />

            <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4 py-16 md:gap-28 md:px-6 md:py-24">
                {/* Intro */}
                <Reveal>
                    <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
                        <SectionHeading
                            eyebrow="Who we are"
                            title="A love letter to Bengali craft"
                        />
                        <div className="flex flex-col gap-5 text-base leading-relaxed text-muted-foreground">
                            <p>
                                Rangbangla began with a simple belief — that the
                                colour and craft of Bengal deserve a place in
                                every wardrobe. From the jamdani looms of
                                Narayanganj to the silk weavers of Rajshahi, our
                                land holds some of the finest textile traditions
                                in the world.
                            </p>
                            <p>
                                We work directly with handloom weavers and
                                karigars, bringing you authentic sarees,
                                panjabi, salwar kameez and festive wear without
                                the middlemen — and delivering it to your
                                doorstep, cash on delivery, anywhere in
                                Bangladesh.
                            </p>
                            <p>
                                Every piece we sell carries a story: of the
                                hands that wove it, the festival it was made for
                                and the family it supports. That is the thread
                                that ties everything we do together.
                            </p>
                        </div>
                    </section>
                </Reveal>

                {/* Stats */}
                <Reveal>
                    <section className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border bg-border md:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center gap-1 bg-card px-4 py-10 text-center"
                            >
                                <span className="font-display text-4xl font-semibold text-primary md:text-5xl">
                                    {stat.value}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </section>
                </Reveal>

                {/* Craft split */}
                <Reveal>
                    <section className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
                        <div className="relative overflow-hidden rounded-3xl">
                            <img
                                src={img(
                                    '1591130901921-3f0652bb3915',
                                    900,
                                    760,
                                )}
                                alt="Handloom weaving in Bengal"
                                loading="lazy"
                                className="aspect-[6/5] w-full object-cover"
                            />
                            <div className="bg-brand-gradient absolute inset-0 opacity-10 mix-blend-multiply" />
                        </div>
                        <div className="flex flex-col gap-5">
                            <SectionHeading
                                eyebrow="How we work"
                                title="From the loom to your doorstep"
                            />
                            <p className="text-base leading-relaxed text-muted-foreground">
                                We travel to weaving clusters across the
                                country, choosing fabrics by hand and
                                commissioning limited runs with the artisans we
                                trust. Nothing is mass-produced; each collection
                                is small, considered and seasonal.
                            </p>
                            <ul className="flex flex-col gap-3 text-sm">
                                {[
                                    'Sourced directly from handloom clusters',
                                    'Quality-checked and finished in Dhaka',
                                    'Carefully packed and shipped nationwide',
                                    '7-day easy returns, cash on delivery',
                                ].map((line) => (
                                    <li
                                        key={line}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Sparkles className="size-3.5" />
                                        </span>
                                        <span className="text-foreground/80">
                                            {line}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </Reveal>

                {/* Values */}
                <Reveal>
                    <section className="flex flex-col gap-10">
                        <SectionHeading
                            eyebrow="What we stand for"
                            title="Craft, fairness and colour"
                            description="The principles that guide every collection we make."
                            align="center"
                        />
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {values.map(({ icon: Icon, title, body }) => (
                                <div
                                    key={title}
                                    className="flex flex-col gap-3 rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md"
                                >
                                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Icon className="size-5" />
                                    </span>
                                    <h3 className="font-display text-lg font-semibold">
                                        {title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </Reveal>
            </div>

            {/* CTA */}
            <section className="bg-brand-gradient text-primary-foreground">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-16 text-center md:px-6 md:py-20">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-white/80 uppercase">
                        <Users className="size-4" /> Join 50,000+ happy shoppers
                    </span>
                    <h2 className="max-w-2xl font-display text-3xl font-semibold text-balance md:text-4xl">
                        Bring home the colour of Bengal
                    </h2>
                    <p className="max-w-lg text-primary-foreground/85">
                        Explore handloom sarees, festive panjabi and more —
                        delivered to your door with cash on delivery.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                        <Button
                            asChild
                            size="lg"
                            className="btn-sheen btn-lime rounded-full"
                        >
                            <Link href={shop.products.index.url()}>
                                Shop the collection
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                        >
                            <Link href="/contact">
                                <Truck className="size-4" /> Get in touch
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
