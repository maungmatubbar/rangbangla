import { Link, router } from '@inertiajs/react';
import {
    Heart,
    LayoutDashboard,
    LayoutGrid,
    LogOut,
    Package,
    Settings,
    Shirt,
} from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import account from '@/routes/account';
import admin from '@/routes/admin';
import { edit } from '@/routes/profile';
import shop from '@/routes/shop';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user.is_admin ? (
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full cursor-pointer font-medium text-primary"
                            href={admin.dashboard.url()}
                            onClick={cleanup}
                        >
                            <LayoutDashboard className="mr-2" />
                            Admin dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full cursor-pointer"
                            href={admin.orders.index.url()}
                            onClick={cleanup}
                        >
                            <Package className="mr-2" />
                            Manage orders
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full cursor-pointer"
                            href={admin.products.index.url()}
                            onClick={cleanup}
                        >
                            <Shirt className="mr-2" />
                            Manage products
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full cursor-pointer"
                            href={edit()}
                            prefetch
                            onClick={cleanup}
                        >
                            <Settings className="mr-2" />
                            Settings
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            ) : (
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full cursor-pointer"
                            href={account.overview.url()}
                            onClick={cleanup}
                        >
                            <LayoutGrid className="mr-2" />
                            My Account
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full cursor-pointer"
                            href={shop.orders.index.url()}
                            onClick={cleanup}
                        >
                            <Package className="mr-2" />
                            My Orders
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full cursor-pointer"
                            href={shop.wishlist.index.url()}
                            onClick={cleanup}
                        >
                            <Heart className="mr-2" />
                            Wishlist
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full cursor-pointer"
                            href={edit()}
                            prefetch
                            onClick={cleanup}
                        >
                            <Settings className="mr-2" />
                            Settings
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
