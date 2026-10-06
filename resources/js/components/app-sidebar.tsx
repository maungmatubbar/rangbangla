import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Package,
    RotateCcw,
    Shirt,
    Store,
    Ticket,
    Users,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { home } from '@/routes';
import admin from '@/routes/admin';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: admin.dashboard.url(), icon: LayoutGrid },
    { title: 'Products', href: admin.products.index.url(), icon: Shirt },
    { title: 'Orders', href: admin.orders.index.url(), icon: Package },
    { title: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { title: 'Customers', href: admin.customers.index.url(), icon: Users },
    { title: 'Returns', href: admin.returns.index.url(), icon: RotateCcw },
];

const footerNavItems: NavItem[] = [
    { title: 'View store', href: home(), icon: Store },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={admin.dashboard.url()} prefetch>
                                <span className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                    <Store className="size-4" />
                                </span>
                                <div className="flex flex-col leading-tight">
                                    <span className="font-display text-sm font-semibold">
                                        Rangbangla
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Admin panel
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
