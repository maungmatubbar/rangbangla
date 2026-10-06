import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    value?: number;
    count?: number;
    className?: string;
};

export function RatingStars({ value = 5, count, className }: Props) {
    return (
        <div className={cn('flex items-center gap-1', className)}>
            <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                        key={index}
                        className={cn(
                            'size-4',
                            index < Math.round(value)
                                ? 'fill-gold text-gold'
                                : 'fill-muted text-muted-foreground/30',
                        )}
                    />
                ))}
            </div>
            {count !== undefined && (
                <span className="text-xs text-muted-foreground">({count})</span>
            )}
        </div>
    );
}
