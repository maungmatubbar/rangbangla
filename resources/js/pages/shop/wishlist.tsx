import { Head, Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccountShell } from '@/components/storefront/account/account-shell';
import { ProductCard } from '@/components/storefront/product-card';
import shop from '@/routes/shop';
import type { Product } from '@/types';

type Props = {
    products: Product[];
};

export default function Wishlist({ products }: Props) {
    return (
        <>
            <Head title="Wishlist" />
            <AccountShell
                active="wishlist"
                title="My wishlist"
                description={`${products.length} item${products.length === 1 ? '' : 's'} you love`}
            >
                {products.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed py-16 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                            <Heart className="size-7 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">
                                Your wishlist is empty
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Tap the heart on any product to save it here.
                            </p>
                        </div>
                        <Button asChild className="rounded-full">
                            <Link href={shop.products.index()}>
                                Discover products
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </AccountShell>
        </>
    );
}
