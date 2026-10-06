import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import shop from '@/routes/shop';

type Collection = {
    name: string;
    category: string;
    blurb: string;
    image: string;
};

const img = (id: string) =>
    `https://images.unsplash.com/photo-${id}?w=700&h=900&fit=crop&crop=faces,center&q=80&auto=format`;

const collections: Collection[] = [
    {
        name: 'Sarees',
        category: 'Saree',
        blurb: 'Jamdani · Katan · Tant',
        image: img('1610030469983-98e550d6193c'),
    },
    {
        name: 'Panjabi',
        category: 'Panjabi',
        blurb: 'Cotton & silk for men',
        image: img('1727835523545-70ee992b5763'),
    },
    {
        name: 'Three-Piece',
        category: 'Three-Piece',
        blurb: 'Festive stitched sets',
        image: img('1706685481823-b8f1a1c11fca'),
    },
    {
        name: 'Kurti',
        category: 'Kurti',
        blurb: 'Everyday elegance',
        image: img('1622207691293-5cd80466dab3'),
    },
];

export function FeaturedCollections() {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {collections.map((collection) => (
                <Link
                    key={collection.category}
                    href={shop.products.index.url({
                        query: { category: collection.category },
                    })}
                    className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl bg-muted p-5 text-white transition-transform duration-300 hover:-translate-y-1"
                >
                    {/* Image */}
                    <img
                        src={collection.image}
                        alt={collection.name}
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Legibility + brand overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative flex flex-col gap-1">
                        <span className="font-display text-2xl font-semibold">
                            {collection.name}
                        </span>
                        <span className="text-sm text-white/85">
                            {collection.blurb}
                        </span>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand">
                            Shop now
                            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
