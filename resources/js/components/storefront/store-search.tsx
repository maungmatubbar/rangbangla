import { router } from '@inertiajs/react';
import { ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import shop from '@/routes/shop';

type Props = {
    className?: string;
    autoFocus?: boolean;
    onSubmitted?: () => void;
};

export function StoreSearch({ className, autoFocus, onSubmitted }: Props) {
    const [query, setQuery] = useState('');

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        router.get(
            shop.products.index.url(),
            { q: query || undefined },
            { preserveScroll: true },
        );
        onSubmitted?.();
    };

    return (
        <form
            onSubmit={submit}
            role="search"
            className={cn('group relative w-full', className)}
        >
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
            <Input
                type="search"
                value={query}
                autoFocus={autoFocus}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sarees, panjabi, kurti…"
                aria-label="Search products"
                className="h-11 rounded-full border border-foreground/15 bg-background pr-12 pl-10 shadow-sm transition-colors hover:border-foreground/25 focus-visible:border-ring"
            />
            <button
                type="submit"
                aria-label="Search"
                className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:outline-none active:scale-95"
            >
                <ArrowRight className="size-4" />
            </button>
        </form>
    );
}
