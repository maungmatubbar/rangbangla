import { Link, usePage } from '@inertiajs/react';
import { Heart, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { cn } from '@/lib/utils';
import { login } from '@/routes';
import shop from '@/routes/shop';

function CountBadge({ count }: { count: number }) {
    if (count <= 0) return null;
    return (
        // Keying by count remounts the badge so the pop replays on every change.
        <span
            key={count}
            className="bg-lime text-lime-ink animate-badge-pop absolute -top-1 -right-1 inline-flex min-w-4.5 items-center justify-center rounded-full px-1 text-[0.6rem] font-semibold shadow-sm"
        >
            {count > 99 ? '99+' : count}
        </span>
    );
}

export function HeaderActions({ className }: { className?: string }) {
    const { auth, cart, wishlist } = usePage().props;

    return (
        <div className={cn('flex items-center gap-1', className)}>
            <Button
                asChild
                variant="ghost"
                size="icon"
                className="relative rounded-full"
            >
                <Link href={shop.wishlist.index.url()} aria-label="Wishlist">
                    <Heart className="size-5" />
                    <CountBadge count={wishlist?.count ?? 0} />
                </Link>
            </Button>

            <Button
                asChild
                variant="ghost"
                size="icon"
                className="relative rounded-full"
            >
                <Link href={shop.cart.show.url()} aria-label="Cart">
                    <ShoppingBag className="size-5" />
                    <CountBadge count={cart?.count ?? 0} />
                </Link>
            </Button>

            {auth.user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            aria-label="Account"
                        >
                            <User className="size-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="ml-1 hidden items-center gap-2 sm:flex">
                    <Button asChild size="sm" className="rounded-full">
                        <Link href={login()}>Log in</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
