import { useEffect, useState } from 'react';
import { BrandWordmark } from '@/components/storefront/brand-wordmark';
import { CategoryMegaMenu } from '@/components/storefront/category-mega-menu';
import { HeaderActions } from '@/components/storefront/header-actions';
import { MobileNav } from '@/components/storefront/mobile-nav';
import { StoreSearch } from '@/components/storefront/store-search';
import { cn } from '@/lib/utils';

export function StoreHeader() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={cn(
                'sticky top-0 z-40 border-b bg-background/85 backdrop-blur transition-shadow',
                scrolled && 'shadow-sm',
            )}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6">
                {/* Left: menu + brand + nav */}
                <div className="flex items-center gap-3">
                    <MobileNav />
                    <BrandWordmark className="mr-1" />
                    <CategoryMegaMenu />
                </div>

                {/* Center: search (auto margins keep it centered) */}
                <div className="mx-auto hidden w-full max-w-md md:block">
                    <StoreSearch />
                </div>

                {/* Right: actions */}
                <HeaderActions className="ml-auto md:ml-0" />
            </div>
        </header>
    );
}
