import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

const messages = [
    'Free delivery on orders over ৳3,000',
    'Cash on Delivery across Bangladesh',
    'New Season collection just dropped',
    '7-day easy returns, no questions asked',
    'Use code WELCOME10 for 10% off your first order',
];

export function AnnouncementBar() {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    // Two identical tracks sit side by side so the marquee loops seamlessly.
    const track = (
        <div className="flex shrink-0 items-center gap-10 px-5">
            {messages.map((message) => (
                <span
                    key={message}
                    className="flex items-center gap-2 text-xs font-medium whitespace-nowrap sm:text-sm"
                >
                    <Sparkles className="size-3.5 text-lime-ink/70" />
                    {message}
                </span>
            ))}
        </div>
    );

    return (
        <div className="bg-brand-gradient-x relative overflow-hidden text-lime-ink">
            <div className="group flex overflow-hidden py-2">
                <div className="animate-marquee flex items-center group-hover:[animation-play-state:paused]">
                    {track}
                    {track}
                </div>
            </div>
            <button
                type="button"
                onClick={() => setVisible(false)}
                aria-label="Dismiss announcement"
                className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full bg-black/10 p-1 text-lime-ink/60 backdrop-blur transition-colors hover:bg-black/15 hover:text-lime-ink"
            >
                <X className="size-3.5" />
            </button>
        </div>
    );
}
