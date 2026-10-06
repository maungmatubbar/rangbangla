import { Head, Link, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Send,
    Twitter,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHero } from '@/components/storefront/page-hero';
import { Reveal } from '@/components/storefront/reveal';

type ContactCard = {
    icon: ComponentType<{ className?: string }>;
    title: string;
    lines: string[];
    href?: string;
};

const cards: ContactCard[] = [
    {
        icon: MapPin,
        title: 'Visit us',
        lines: ['House 42, Road 11, Banani', 'Dhaka 1213, Bangladesh'],
    },
    {
        icon: Phone,
        title: 'Call us',
        lines: ['+880 1700-000000', 'Sat–Thu, 10am – 8pm'],
        href: 'tel:+8801700000000',
    },
    {
        icon: Mail,
        title: 'Email us',
        lines: ['hello@rangbangla.com', 'We reply within 24 hours'],
        href: 'mailto:hello@rangbangla.com',
    },
    {
        icon: Clock,
        title: 'Business hours',
        lines: ['Saturday – Thursday', '10:00am – 8:00pm (BST)'],
    },
];

const socials = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
];

export default function Contact() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset('subject', 'message'),
        });
    };

    return (
        <>
            <Head title="Contact Us" />

            <PageHero
                eyebrow="We'd love to hear from you"
                title="Get in touch"
                description="Questions about an order, sizing, a custom piece or a wholesale enquiry? Our team is here to help."
            />

            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
                {/* Contact details */}
                <Reveal className="flex flex-col gap-8">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {cards.map(({ icon: Icon, title, lines, href }) => {
                            const body = (
                                <div className="flex h-full flex-col gap-2 rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md">
                                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Icon className="size-5" />
                                    </span>
                                    <h3 className="mt-1 font-medium">
                                        {title}
                                    </h3>
                                    {lines.map((line) => (
                                        <p
                                            key={line}
                                            className="text-sm text-muted-foreground"
                                        >
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            );
                            return href ? (
                                <a key={title} href={href} className="group">
                                    {body}
                                </a>
                            ) : (
                                <div key={title}>{body}</div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-3 rounded-2xl bg-secondary/50 p-6">
                        <h3 className="font-medium">Follow our journey</h3>
                        <p className="text-sm text-muted-foreground">
                            New collections, styling tips and behind-the-loom
                            stories.
                        </p>
                        <div className="flex gap-2">
                            {socials.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="inline-flex size-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                                >
                                    <Icon className="size-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* Form */}
                <Reveal
                    delay={120}
                    className="rounded-3xl border bg-card p-6 shadow-sm md:p-8"
                >
                    <div className="flex flex-col gap-1.5">
                        <h2 className="font-display text-2xl font-semibold tracking-tight">
                            Send us a message
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Fill in the form and we'll get back to you shortly.
                        </p>
                    </div>

                    {recentlySuccessful && (
                        <div className="mt-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-primary">
                            <CheckCircle2 className="size-5 shrink-0" />
                            <span>
                                Thank you — your message has been sent. We'll be
                                in touch within 24 hours.
                            </span>
                        </div>
                    )}

                    <form
                        onSubmit={submit}
                        className="mt-6 flex flex-col gap-5"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field
                                id="name"
                                label="Full name"
                                error={errors.name}
                            >
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    aria-invalid={!!errors.name}
                                    placeholder="Your name"
                                    autoComplete="name"
                                    required
                                />
                            </Field>
                            <Field
                                id="email"
                                label="Email address"
                                error={errors.email}
                            >
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    aria-invalid={!!errors.email}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </Field>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field
                                id="phone"
                                label="Phone (optional)"
                                error={errors.phone}
                            >
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    aria-invalid={!!errors.phone}
                                    placeholder="+880 1XXX-XXXXXX"
                                    autoComplete="tel"
                                />
                            </Field>
                            <Field
                                id="subject"
                                label="Subject"
                                error={errors.subject}
                            >
                                <Input
                                    id="subject"
                                    value={data.subject}
                                    onChange={(e) =>
                                        setData('subject', e.target.value)
                                    }
                                    aria-invalid={!!errors.subject}
                                    placeholder="How can we help?"
                                    required
                                />
                            </Field>
                        </div>

                        <Field
                            id="message"
                            label="Message"
                            error={errors.message}
                        >
                            <Textarea
                                id="message"
                                value={data.message}
                                onChange={(e) =>
                                    setData('message', e.target.value)
                                }
                                aria-invalid={!!errors.message}
                                placeholder="Tell us a little more…"
                                rows={6}
                                required
                            />
                        </Field>

                        <div className="flex items-center justify-between gap-4">
                            <p className="text-xs text-muted-foreground">
                                By submitting, you agree to our{' '}
                                <Link
                                    href="/privacy"
                                    className="underline underline-offset-2 hover:text-primary"
                                >
                                    privacy policy
                                </Link>
                                .
                            </p>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={processing}
                                className="shrink-0 gap-2"
                            >
                                {processing ? 'Sending…' : 'Send message'}
                                <Send className="size-4" />
                            </Button>
                        </div>
                    </form>
                </Reveal>
            </div>
        </>
    );
}

function Field({
    id,
    label,
    error,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
