import { Link } from '@inertiajs/react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { storeNav } from '@/lib/nav';
import { cn } from '@/lib/utils';

export function CategoryMegaMenu() {
    return (
        <NavigationMenu viewport={false} className="hidden lg:flex">
            <NavigationMenuList>
                {storeNav.map((item) =>
                    item.columns ? (
                        <NavigationMenuItem key={item.label}>
                            <NavigationMenuTrigger className="nav-underline bg-transparent text-sm font-medium data-[state=open]:text-primary">
                                {item.label}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="grid w-[22rem] gap-1 p-2">
                                    {item.columns.flatMap((column) =>
                                        column.links.map((link) => (
                                            <NavigationMenuLink
                                                key={link.href}
                                                asChild
                                            >
                                                <Link
                                                    href={link.href}
                                                    className="rounded-lg p-3 transition-colors hover:bg-accent/60"
                                                >
                                                    <div className="font-medium">
                                                        {link.label}
                                                    </div>
                                                    {link.description && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {link.description}
                                                        </p>
                                                    )}
                                                </Link>
                                            </NavigationMenuLink>
                                        )),
                                    )}
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ) : (
                        <NavigationMenuItem key={item.label}>
                            <NavigationMenuLink
                                asChild
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    'nav-underline',
                                )}
                            >
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'bg-transparent text-sm font-medium',
                                        item.highlight &&
                                            'font-semibold text-primary',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ),
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
