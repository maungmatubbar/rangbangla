import { Head, Link } from '@inertiajs/react';
import { Mail, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/storefront/page-hero';

type Section = {
    id: string;
    title: string;
    paragraphs: string[];
    bullets?: string[];
};

const sections: Section[] = [
    {
        id: 'overview',
        title: '1. Overview',
        paragraphs: [
            'Rangbangla ("we", "us", "our") respects your privacy and is committed to protecting the personal information you share with us. This policy explains what we collect, how we use it, and the choices you have.',
            'By using rangbangla.com and placing an order, you agree to the practices described in this policy.',
        ],
    },
    {
        id: 'information',
        title: '2. Information we collect',
        paragraphs: [
            'We collect information you provide directly and information gathered automatically as you use the site:',
        ],
        bullets: [
            'Contact details — your name, phone number, email and delivery address.',
            'Order information — the products you buy, order history and delivery preferences.',
            'Verification data — the one-time codes (OTP) used to confirm your phone number at login and checkout.',
            'Usage data — pages visited, device and browser information, collected via cookies.',
        ],
    },
    {
        id: 'use',
        title: '3. How we use your information',
        paragraphs: ['We use your information to:'],
        bullets: [
            'Process and deliver your orders, including cash-on-delivery handling.',
            'Verify your identity and secure your account with phone-based OTP.',
            'Send order updates, delivery notifications and support replies.',
            'Improve our products, collections and the shopping experience.',
            'Share occasional offers and new-collection news — only if you opt in.',
        ],
    },
    {
        id: 'cookies',
        title: '4. Cookies',
        paragraphs: [
            'We use essential cookies to keep you signed in, remember your cart and keep checkout secure. We may also use analytics cookies to understand how the site is used. You can control cookies through your browser settings; disabling essential cookies may affect how the site works.',
        ],
    },
    {
        id: 'sharing',
        title: '5. How we share information',
        paragraphs: [
            'We do not sell your personal information. We share it only where necessary to run the store:',
        ],
        bullets: [
            'Delivery partners, to ship and hand over your order.',
            'Service providers (hosting, SMS and analytics) who process data on our behalf under confidentiality obligations.',
            'Authorities, where required by law or to protect our legal rights.',
        ],
    },
    {
        id: 'security',
        title: '6. Data security',
        paragraphs: [
            'We apply reasonable technical and organisational measures to protect your data, including encrypted connections and restricted access. No method of transmission over the internet is completely secure, so we cannot guarantee absolute security, but we work hard to safeguard your information.',
        ],
    },
    {
        id: 'retention',
        title: '7. Data retention',
        paragraphs: [
            'We keep your information for as long as your account is active or as needed to provide our services, comply with legal obligations, resolve disputes and enforce our agreements.',
        ],
    },
    {
        id: 'rights',
        title: '8. Your rights',
        paragraphs: [
            'You may request access to the personal data we hold about you, ask us to correct or delete it, or opt out of marketing messages at any time. To exercise any of these rights, contact us using the details below.',
        ],
    },
    {
        id: 'children',
        title: '9. Children',
        paragraphs: [
            'Our store is intended for customers aged 18 and over. We do not knowingly collect personal information from children. If you believe a child has provided us data, please contact us and we will remove it.',
        ],
    },
    {
        id: 'changes',
        title: '10. Changes to this policy',
        paragraphs: [
            'We may update this policy from time to time. When we do, we will revise the "last updated" date at the top of this page. Significant changes will be communicated through the site.',
        ],
    },
];

export default function Privacy({
    lastUpdated = '',
}: {
    lastUpdated?: string;
}) {
    return (
        <>
            <Head title="Privacy Policy" />

            <PageHero
                eyebrow="Your privacy matters"
                title="Privacy Policy"
                description="How Rangbangla collects, uses and protects your personal information."
            />

            <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
                {lastUpdated && (
                    <p className="mb-10 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
                        <ShieldCheck className="size-4 text-primary" />
                        Last updated: {lastUpdated}
                    </p>
                )}

                <div className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
                    {/* Table of contents */}
                    <aside className="hidden lg:block">
                        <nav className="sticky top-24 flex flex-col gap-1 border-l">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="-ml-px border-l border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                                >
                                    {section.title}
                                </a>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <article className="flex max-w-3xl flex-col gap-10">
                        {sections.map((section) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className="scroll-mt-24"
                            >
                                <h2 className="font-display text-2xl font-semibold tracking-tight text-balance">
                                    {section.title}
                                </h2>
                                <div className="mt-4 flex flex-col gap-4 leading-relaxed text-muted-foreground">
                                    {section.paragraphs.map((p, i) => (
                                        <p key={i}>{p}</p>
                                    ))}
                                    {section.bullets && (
                                        <ul className="flex flex-col gap-2.5">
                                            {section.bullets.map((b) => (
                                                <li
                                                    key={b}
                                                    className="flex gap-3"
                                                >
                                                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                                                    <span>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </section>
                        ))}

                        {/* Contact block */}
                        <section
                            id="contact"
                            className="scroll-mt-24 rounded-2xl bg-secondary/50 p-6 md:p-8"
                        >
                            <h2 className="font-display text-2xl font-semibold tracking-tight">
                                11. Contact us
                            </h2>
                            <p className="mt-4 leading-relaxed text-muted-foreground">
                                If you have any questions about this privacy
                                policy or how we handle your data, we're happy
                                to help.
                            </p>
                            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                                <a
                                    href="mailto:hello@rangbangla.com"
                                    className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                                >
                                    <Mail className="size-4" />
                                    hello@rangbangla.com
                                </a>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                                >
                                    Contact form →
                                </Link>
                            </div>
                        </section>
                    </article>
                </div>
            </div>
        </>
    );
}
