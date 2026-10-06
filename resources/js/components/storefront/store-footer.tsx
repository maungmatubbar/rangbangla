import { Link } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Truck,
    Twitter,
    Undo2,
} from 'lucide-react';
import { BrandWordmark } from '@/components/storefront/brand-wordmark';
import { NewsletterForm } from '@/components/storefront/newsletter-form';
import { storeNav } from '@/lib/nav';
import shop from '@/routes/shop';

const trust = [
    { icon: Truck, label: 'Nationwide delivery' },
    { icon: ShieldCheck, label: 'Cash on delivery' },
    { icon: Undo2, label: '7-day easy returns' },
    { icon: ShieldCheck, label: '100% authentic' },
];

const company = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Track Order', href: shop.orders.index.url() },
];

const help = [
    { label: 'Shipping & Delivery', href: shop.products.index.url() },
    { label: 'Returns & Exchange', href: shop.products.index.url() },
    { label: 'Size Guide', href: shop.products.index.url() },
    { label: 'Contact Support', href: '/contact' },
];

const contact = [
    { icon: MapPin, value: 'Dhaka, Bangladesh' },
    { icon: Phone, value: '+880 1700-000000' },
    { icon: Mail, value: 'hello@rangbangla.com' },
];

const socials = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Twitter, label: 'Twitter' },
];

const payments = ['Cash on Delivery', 'bKash', 'Nagad', 'Card'];

export function StoreFooter() {
    const shopLinks = storeNav
        .flatMap((item) => item.columns?.flatMap((c) => c.links) ?? [])
        .slice(0, 6);

    return (
        <footer className="mt-auto bg-secondary/40">
            {/* Brand-gradient top accent. */}
            <div aria-hidden className="bg-brand-gradient-x h-0.5 w-full" />

            {/* Trust strip */}
            <div className="border-b">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-7 md:grid-cols-4 md:px-6">
                    {trust.map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="flex items-center justify-center gap-3 text-sm font-medium"
                        >
                            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground shadow-sm ring-1 ring-black/5">
                                <Icon className="size-4.5" />
                            </span>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-12 lg:gap-8">
                {/* Brand */}
                <div className="flex flex-col gap-5 lg:col-span-4">
                    <BrandWordmark />
                    <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                        Rangbangla brings the colour of Bengal to your wardrobe
                        — handloom sarees, panjabi and festive wear, woven by
                        local artisans and delivered across Bangladesh.
                    </p>
                    <div className="flex flex-col gap-2.5 text-sm">
                        {contact.map(({ icon: Icon, value }) => (
                            <span
                                key={value}
                                className="flex items-center gap-2.5 text-muted-foreground"
                            >
                                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-black/5">
                                    <Icon className="size-3.5 text-foreground" />
                                </span>
                                {value}
                            </span>
                        ))}
                    </div>
                    <div className="mt-1 flex gap-2.5">
                        {socials.map(({ icon: Icon, label }) => (
                            <a
                                key={label}
                                href="#"
                                aria-label={label}
                                className="inline-flex size-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                            >
                                <Icon className="size-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Link columns */}
                <FooterColumn
                    heading="Shop"
                    links={shopLinks}
                    className="lg:col-span-2"
                />
                <FooterColumn
                    heading="Company"
                    links={company}
                    className="lg:col-span-2"
                />
                <FooterColumn
                    heading="Help"
                    links={help}
                    className="lg:col-span-2"
                />

                {/* Newsletter */}
                <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-2">
                    <FooterHeading>Join the list</FooterHeading>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        Be first to know about new collections and Eid offers.
                    </p>
                    <NewsletterForm className="max-w-full flex-col gap-2.5" />
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-5 text-xs text-muted-foreground md:flex-row md:justify-between md:px-6">
                    <p className="order-3 md:order-1">
                        © {new Date().getFullYear()} Rangbangla. All rights
                        reserved.
                    </p>
                    <div className="order-1 flex flex-wrap items-center justify-center gap-2 md:order-2">
                        {payments.map((method) => (
                            <span
                                key={method}
                                className="rounded-md border bg-background px-2 py-1 text-[0.7rem] font-medium text-foreground/70"
                            >
                                {method}
                            </span>
                        ))}
                    </div>
                    <div className="order-2 flex items-center gap-4 md:order-3">
                        <Link
                            href="/about"
                            className="transition-colors hover:text-foreground"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="transition-colors hover:text-foreground"
                        >
                            Contact
                        </Link>
                        <Link
                            href="/privacy"
                            className="transition-colors hover:text-foreground"
                        >
                            Privacy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="text-xs font-semibold tracking-[0.15em] text-foreground uppercase">
            {children}
        </h3>
    );
}

function FooterColumn({
    heading,
    links,
    className,
}: {
    heading: string;
    links: { label: string; href: string }[];
    className?: string;
}) {
    return (
        <div className={className}>
            <FooterHeading>{heading}</FooterHeading>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
                {links.map((link) => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            className="inline-block transition-all hover:translate-x-0.5 hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
