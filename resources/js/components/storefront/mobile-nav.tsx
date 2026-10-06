import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { BrandWordmark } from '@/components/storefront/brand-wordmark';
import { StoreSearch } from '@/components/storefront/store-search';
import { storeNav } from '@/lib/nav';
import { login } from '@/routes';

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const { auth } = usePage().props;
    const close = () => setOpen(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu className="size-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 gap-0 p-0">
                <SheetHeader className="border-b">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <BrandWordmark />
                </SheetHeader>

                <div className="flex flex-col gap-6 overflow-y-auto p-4">
                    <StoreSearch onSubmitted={close} />

                    <nav className="flex flex-col gap-5">
                        {storeNav.map((item) =>
                            item.columns ? (
                                <div
                                    key={item.label}
                                    className="flex flex-col gap-2"
                                >
                                    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                        {item.label}
                                    </span>
                                    <div className="flex flex-col">
                                        {item.columns.flatMap((column) =>
                                            column.links.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={close}
                                                    className="rounded-md px-2 py-2 text-sm hover:bg-accent"
                                                >
                                                    {link.label}
                                                </Link>
                                            )),
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={close}
                                    className="rounded-md px-2 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    {item.label}
                                </Link>
                            ),
                        )}
                    </nav>

                    <div className="flex flex-col border-t pt-4">
                        {[
                            { label: 'About Us', href: '/about' },
                            { label: 'Contact', href: '/contact' },
                            { label: 'Privacy Policy', href: '/privacy' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={close}
                                className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {!auth.user && (
                        <div className="flex flex-col gap-2 border-t pt-4">
                            <Button asChild onClick={close}>
                                <Link href={login()}>Log in / Sign up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
