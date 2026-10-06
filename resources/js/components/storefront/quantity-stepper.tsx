import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    className?: string;
    size?: 'sm' | 'md';
};

export function QuantityStepper({
    value,
    onChange,
    min = 1,
    max = 99,
    className,
    size = 'md',
}: Props) {
    const btn = size === 'sm' ? 'size-8' : 'size-10';
    const icon = size === 'sm' ? 'size-3.5' : 'size-4';

    return (
        <div
            className={cn(
                'flex items-center rounded-full border bg-background',
                className,
            )}
        >
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn('rounded-full', btn)}
                disabled={value <= min}
                onClick={() => onChange(Math.max(min, value - 1))}
                aria-label="Decrease quantity"
            >
                <Minus className={icon} />
            </Button>
            <span
                className={cn(
                    'text-center font-semibold tabular-nums',
                    size === 'sm' ? 'w-8 text-sm' : 'w-10',
                )}
            >
                {value}
            </span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn('rounded-full', btn)}
                disabled={value >= max}
                onClick={() => onChange(Math.min(max, value + 1))}
                aria-label="Increase quantity"
            >
                <Plus className={icon} />
            </Button>
        </div>
    );
}
