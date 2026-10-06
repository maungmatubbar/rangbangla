import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    color: string;
    hex: string | null;
    selected?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    size?: 'sm' | 'md';
};

export function ColorSwatch({
    color,
    hex,
    selected = false,
    disabled = false,
    onClick,
    size = 'md',
}: Props) {
    const dim = size === 'sm' ? 'size-6' : 'size-9';

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            title={color}
            aria-label={color}
            aria-pressed={selected}
            className={cn(
                'relative inline-flex items-center justify-center rounded-full border transition-all',
                dim,
                selected
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : 'hover:scale-105',
                disabled && 'cursor-not-allowed opacity-40',
            )}
            style={{ backgroundColor: hex ?? '#e5e5e5' }}
        >
            {selected && (
                <Check
                    className="size-4 drop-shadow"
                    style={{
                        color: isLight(hex) ? '#1a1a1a' : '#ffffff',
                    }}
                />
            )}
        </button>
    );
}

/** Rough luminance check so the check-mark stays legible on any swatch. */
function isLight(hex: string | null): boolean {
    if (!hex) return true;
    const value = hex.replace('#', '');
    if (value.length !== 6) return false;
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}
