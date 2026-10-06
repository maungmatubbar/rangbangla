import { Head, Link } from '@inertiajs/react';
import { BadgeCheck, Headphones, RotateCcw, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandStory } from '@/components/storefront/home/brand-story';
import { CategorySidebar } from '@/components/storefront/home/category-sidebar';
import { FeaturedCollections } from '@/components/storefront/home/featured-collections';
import { HeroSlider } from '@/components/storefront/home/hero-slider';
import { PromoBanner } from '@/components/storefront/home/promo-banner';
import { Testimonials } from '@/components/storefront/home/testimonials';
import { NewsletterForm } from '@/components/storefront/newsletter-form';
import { ProductCarousel } from '@/components/storefront/product-carousel';
import { ProductCard } from '@/components/storefront/product-card';
import { Reveal } from '@/components/storefront/reveal';
import { SectionHeading } from '@/components/storefront/section-heading';
import shop from '@/routes/shop';
import type { Product } from '@/types';

type Props = {
    featured: Product[];
    newArrivals: Product[];
    categories: string[];
};

const perks = [
    { icon: Truck, label: 'Nationwide delivery' },
    { icon: BadgeCheck, label: '100% authentic craft' },
    { icon: RotateCcw, label: '7-day easy returns' },
    { icon: Headphones, label: 'Friendly support' },
];

export default function Welcome({ featured, newArrivals }: Props) {
    return (
        <>
            <Head title="Rangbangla — Bengali Ethnic Fashion" />

            {/* Category sidebar + hero slider (storefront landing concept) */}
            <div className="mx-auto max-w-7xl px-4 pt-4 md:px-6">
                <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <CategorySidebar className="hidden lg:flex" />
                    <HeroSlider />
                </div>
            </div>

            {/* Perks strip */}
            <div className="border-b bg-secondary/40">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 md:grid-cols-4 md:px-6">
                    {perks.map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground"
                        >
                            <Icon className="size-5 text-primary" />
                            {label}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-14 md:gap-24 md:px-6 md:py-20">
                {/* Collections */}
                <Reveal>
                    <section className="flex flex-col gap-6">
                        <SectionHeading
                            eyebrow="Shop by category"
                            title="Explore our collections"
                            description="From heirloom sarees to festive panjabi — find your celebration look."
                        />
                        <FeaturedCollections />
                    </section>
                </Reveal>

                {/* New arrivals */}
                {newArrivals.length > 0 && (
                    <Reveal>
                        <section className="flex flex-col gap-6">
                            <SectionHeading
                                eyebrow="Just in"
                                title="New arrivals"
                                viewAllHref={shop.products.index.url({
                                    query: { sort: 'newest' },
                                })}
                            />
                            <ProductCarousel products={newArrivals} />
                        </section>
                    </Reveal>
                )}

                <Reveal>
                    <PromoBanner />
                </Reveal>

                {/* Featured */}
                {featured.length > 0 && (
                    <section className="flex flex-col gap-6">
                        <Reveal>
                            <SectionHeading
                                eyebrow="Handpicked"
                                title="Festive favourites"
                                viewAllHref={shop.products.index.url()}
                            />
                        </Reveal>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            {featured.slice(0, 4).map((product, index) => (
                                <Reveal key={product.id} delay={index * 90}>
                                    <ProductCard product={product} />
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}

                <Reveal>
                    <BrandStory />
                </Reveal>

                {/* Testimonials */}
                <Reveal>
                    <section className="flex flex-col gap-6">
                        <SectionHeading
                            eyebrow="Loved by customers"
                            title="What our shoppers say"
                            align="center"
                        />
                        <Testimonials />
                    </section>
                </Reveal>
            </div>

            {/* Newsletter CTA */}
            <section className="bg-brand-gradient text-primary-foreground">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-14 text-center md:px-6">
                    <h2 className="font-display text-3xl font-semibold text-balance md:text-4xl">
                        Join the Rangbangla family
                    </h2>
                    <p className="max-w-lg text-primary-foreground/85">
                        Subscribe for early access to new collections, styling
                        tips and exclusive festive offers.
                    </p>
                    <NewsletterForm className="justify-center" />
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="mt-1 rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                        <Link href={shop.products.index.url()}>
                            Start shopping
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
