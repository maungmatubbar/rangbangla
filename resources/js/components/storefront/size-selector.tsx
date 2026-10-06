import { cn } from '@/lib/utils';

type Props = {
    sizes: string[];
    value: string | null;
    onChange: (size: string) => void;
    disabledSizes?: string[];
    className?: string;
};

export function SizeSelector({
    sizes,
    value,
    onChange,
    disabledSizes = [],
    className,
}: Props) {
    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {sizes.map((size) => {
                const disabled = disabledSizes.includes(size);
                const active = value === size;

                return (
                    <button
                        key={size}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(size)}
                        aria-pressed={active}
                        className={cn(
                            'min-w-11 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                            active
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-input bg-background hover:border-primary hover:text-primary',
                            disabled &&
                                'cursor-not-allowed text-muted-foreground line-through opacity-50 hover:border-input hover:text-muted-foreground',
                        )}
                    >
                        {size}
                    </button>
                );
            })}
        </div>
    );
}
