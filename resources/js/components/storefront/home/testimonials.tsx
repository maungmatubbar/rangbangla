import { Card, CardContent } from '@/components/ui/card';
import { RatingStars } from '@/components/storefront/rating-stars';

const reviews = [
    {
        name: 'Nusrat J.',
        location: 'Dhaka',
        quote: 'The jamdani saree is even more beautiful in person. Fast delivery and the packaging felt premium.',
    },
    {
        name: 'Tanvir A.',
        location: 'Chattogram',
        quote: 'Bought a silk panjabi for Eid — perfect fit and rich colour. Cash on delivery made it effortless.',
    },
    {
        name: 'Farhana K.',
        location: 'Sylhet',
        quote: 'Great quality three-piece at an honest price. This is my go-to for festive shopping now.',
    },
];

export function Testimonials() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
                <Card
                    key={review.name}
                    className="rounded-2xl border-border/70"
                >
                    <CardContent className="flex flex-col gap-3">
                        <RatingStars value={5} />
                        <p className="text-sm leading-relaxed text-foreground/90">
                            “{review.quote}”
                        </p>
                        <div className="mt-1 text-sm">
                            <span className="font-medium">{review.name}</span>
                            <span className="text-muted-foreground">
                                {' '}
                                · {review.location}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
