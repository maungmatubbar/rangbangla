import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
    children: React.ReactNode;
    className?: string;
    /** Delay in ms before the reveal transition starts. */
    delay?: number;
};

/**
 * Fades + slides its children into view the first time they enter the viewport.
 */
export function Reveal({ children, className, delay = 0 }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShown(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
            className={cn(
                'transition-all duration-700 ease-out will-change-transform',
                shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
                className,
            )}
        >
            {children}
        </div>
    );
}
