import { Link, router } from '@inertiajs/react';
import { Heart, LayoutGrid, LogOut, MapPin, Package, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import account from '@/routes/account';
import { logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import shop from '@/routes/shop';
import { cn } from '@/lib/utils';

type AccountTab = 'overview' | 'orders' | 'wishlist' | 'addresses' | 'profile';

type Props = {
    active: AccountTab;
    title: string;
    description?: string;
    children: React.ReactNode;
};

const navItems: {
    key: AccountTab;
    label: string;
    href: string;
    icon: LucideIcon;
}[] = [
    {
        key: 'overview',
        label: 'Overview',
        href: account.overview.url(),
        icon: LayoutGrid,
    },
    {
        key: 'orders',
        label: 'My Orders',
        href: shop.orders.index.url(),
        icon: Package,
    },
    {
        key: 'wishlist',
        label: 'Wishlist',
        href: shop.wishlist.index.url(),
        icon: Heart,
    },
    {
        key: 'addresses',
        label: 'Addresses',
        href: account.addresses.index.url(),
        icon: MapPin,
    },
    { key: 'profile', label: 'Profile', href: editProfile.url(), icon: User },
];

export function AccountShell({ active, title, description, children }: Props) {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
            <div className="mb-8 flex flex-col gap-1">
                <span className="text-brand text-xs font-semibold tracking-[0.2em] uppercase">
                    My Account
                </span>
                <h1 className="font-display text-3xl font-semibold tracking-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
                <aside className="lg:sticky lg:top-24 lg:self-start">
                    <nav className="flex flex-col gap-1 rounded-2xl border bg-card p-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                        active === item.key
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                                    )}
                                >
                                    <Icon className="size-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() =>
                                router.post(
                                    logout.url(),
                                    {},
                                    { onFinish: () => router.flushAll() },
                                )
                            }
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                            <LogOut className="size-4" />
                            Log out
                        </button>
                    </nav>
                </aside>

                <div className="min-w-0">{children}</div>
            </div>
        </div>
    );
}
