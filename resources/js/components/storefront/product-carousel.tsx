import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/storefront/product-card';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

type Props = {
    products: Product[];
    className?: string;
};

export function ProductCarousel({ products, className }: Props) {
    const scroller = useRef<HTMLDivElement>(null);

    const scrollBy = (direction: 1 | -1) => {
        const node = scroller.current;
        if (!node) return;
        node.scrollBy({
            left: direction * node.clientWidth * 0.8,
            behavior: 'smooth',
        });
    };

    if (products.length === 0) return null;

    return (
        <div className={cn('relative', className)}>
            <div
                ref={scroller}
                className="-mx-1 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [&::-webkit-scrollbar]:hidden"
            >
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        className="w-[15rem] shrink-0 snap-start sm:w-[16rem]"
                    />
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => scrollBy(-1)}
                aria-label="Scroll left"
                className="absolute top-1/2 -left-3 hidden -translate-y-1/2 rounded-full bg-background shadow-md md:inline-flex"
            >
                <ChevronLeft className="size-4" />
            </Button>
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => scrollBy(1)}
                aria-label="Scroll right"
                className="absolute top-1/2 -right-3 hidden -translate-y-1/2 rounded-full bg-background shadow-md md:inline-flex"
            >
                <ChevronRight className="size-4" />
            </Button>
        </div>
    );
}
