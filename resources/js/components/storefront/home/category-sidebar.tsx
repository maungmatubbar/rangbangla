import { Link } from '@inertiajs/react';
import {
    ChevronRight,
    Flower2,
    Gem,
    Layers,
    type LucideIcon,
    Scissors,
    Shapes,
    Shirt,
    Sparkles,
    Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import shop from '@/routes/shop';

type CategoryItem = {
    label: string;
    href: string;
    icon: LucideIcon;
    accent?: boolean;
};

const byCategory = (name: string): string =>
    shop.products.index.url({ query: { category: name } });

const categories: CategoryItem[] = [
    { label: 'Sarees', href: byCategory('Saree'), icon: Flower2 },
    { label: 'Salwar Kameez', href: byCategory('Salwar Kameez'), icon: Shirt },
    { label: 'Three-Piece', href: byCategory('Three-Piece'), icon: Layers },
    { label: 'Kurti', href: byCategory('Kurti'), icon: Shapes },
    { label: 'Panjabi', href: byCategory('Panjabi'), icon: Shirt },
    { label: 'Kurta', href: byCategory('Kurta'), icon: Scissors },
    { label: 'Fatua', href: byCategory('Fatua'), icon: Shirt },
    { label: 'Accessories', href: byCategory('Accessories'), icon: Gem },
    {
        label: 'New Arrivals',
        href: shop.products.index.url({ query: { sort: 'newest' } }),
        icon: Sparkles,
    },
    {
        label: 'Sale',
        href: shop.products.index.url({ query: { sale: 1 } }),
        icon: Tag,
        accent: true,
    },
];

export function CategorySidebar({ className }: { className?: string }) {
    return (
        <nav
            aria-label="Shop by category"
            className={cn(
                'flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm',
                className,
            )}
        >
            <div className="flex items-center gap-2 border-b bg-secondary/40 px-4 py-3">
                <span className="size-2 rounded-full bg-lime" />
                <span className="text-sm font-semibold tracking-tight">
                    All Categories
                </span>
            </div>
            <ul className="flex flex-1 flex-col overflow-y-auto py-1.5">
                {categories.map(({ label, href, icon: Icon, accent }) => (
                    <li key={label}>
                        <Link
                            href={href}
                            className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-lime/10"
                        >
                            <Icon
                                className={cn(
                                    'size-4.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground',
                                    accent && 'text-foreground',
                                )}
                            />
                            <span className="flex-1 truncate">{label}</span>
                            <ChevronRight className="size-4 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
