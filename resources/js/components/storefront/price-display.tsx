import { cn } from '@/lib/utils';
import type { Product } from '@/types';

type Props = {
    product: Pick<
        Product,
        'formatted_price' | 'formatted_compare_at_price' | 'on_sale'
    >;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
};

const sizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-3xl',
};

export function PriceDisplay({ product, className, size = 'md' }: Props) {
    return (
        <div className={cn('flex items-baseline gap-2', className)}>
            <span className={cn('font-semibold text-foreground', sizes[size])}>
                {product.formatted_price}
            </span>
            {product.on_sale && product.formatted_compare_at_price && (
                <span
                    className={cn(
                        'text-muted-foreground line-through',
                        size === 'lg' ? 'text-lg' : 'text-sm',
                    )}
                >
                    {product.formatted_compare_at_price}
                </span>
            )}
        </div>
    );
}
