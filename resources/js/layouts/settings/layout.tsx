import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { AccountShell } from '@/components/storefront/account/account-shell';
import AppLayout from '@/layouts/app-layout';
import StorefrontLayout from '@/layouts/storefront-layout';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const settingsNav: NavItem[] = [
    { title: 'Profile', href: edit() },
    { title: 'Security', href: editSecurity() },
    { title: 'Appearance', href: editAppearance() },
];

/**
 * Settings render inside the panel that matches the user's role: admins keep
 * their admin sidebar (never the storefront), customers get the account shell.
 */
export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage().props;
    const isAdmin = Boolean(auth?.user?.is_admin);

    const body = (
        <div className="flex flex-col gap-6">
            <nav className="flex flex-wrap gap-1 rounded-lg border bg-card p-1">
                {settingsNav.map((item) => (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                            isCurrentOrParentUrl(item.href)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        )}
                    >
                        {item.title}
                    </Link>
                ))}
            </nav>

            <div className="max-w-2xl">{children}</div>
        </div>
    );

    if (isAdmin) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Settings', href: edit() }]}>
                <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-display text-2xl font-semibold tracking-tight">
                            Settings
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your profile and account settings.
                        </p>
                    </div>
                    {body}
                </div>
            </AppLayout>
        );
    }

    return (
        <StorefrontLayout>
            <AccountShell
                active="profile"
                title="Settings"
                description="Manage your profile and account settings."
            >
                {body}
            </AccountShell>
        </StorefrontLayout>
    );
}
