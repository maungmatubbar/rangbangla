import { usePage } from '@inertiajs/react';
import { AnnouncementBar } from '@/components/storefront/announcement-bar';
import { SiteBackground } from '@/components/storefront/site-background';
import { StoreFooter } from '@/components/storefront/store-footer';
import { StoreHeader } from '@/components/storefront/store-header';
import { useFlashToast } from '@/hooks/use-flash-toast';

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useFlashToast();
    // Replay a soft fade-rise on each navigation by keying main to the path.
    const path = usePage().url.split('?')[0];

    return (
        <div className="flex min-h-screen flex-col">
            <SiteBackground />
            <AnnouncementBar />
            <StoreHeader />
            <main key={path} className="page-enter flex-1">
                {children}
            </main>
            <StoreFooter />
        </div>
    );
}
