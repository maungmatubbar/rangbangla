import shop from '@/routes/shop';

export type NavLink = {
    label: string;
    href: string;
    description?: string;
};

export type NavColumn = {
    heading: string;
    links: NavLink[];
};

export type StoreNavItem = {
    label: string;
    href: string;
    /** When present, the item renders a mega-menu of columns. */
    columns?: NavColumn[];
    highlight?: boolean;
};

const category = (name: string): string =>
    shop.products.index.url({ query: { category: name } });

export const storeNav: StoreNavItem[] = [
    {
        label: 'Women',
        href: shop.products.index.url(),
        columns: [
            {
                heading: 'Ethnic Wear',
                links: [
                    {
                        label: 'Sarees',
                        href: category('Saree'),
                        description: 'Jamdani, Katan & Tant',
                    },
                    {
                        label: 'Salwar Kameez',
                        href: category('Salwar Kameez'),
                        description: 'Stitched & unstitched',
                    },
                    {
                        label: 'Three-Piece',
                        href: category('Three-Piece'),
                        description: 'Festive sets',
                    },
                    {
                        label: 'Kurti',
                        href: category('Kurti'),
                        description: 'Everyday elegance',
                    },
                ],
            },
        ],
    },
    {
        label: 'Men',
        href: shop.products.index.url(),
        columns: [
            {
                heading: "Men's Ethnic",
                links: [
                    {
                        label: 'Panjabi',
                        href: category('Panjabi'),
                        description: 'Cotton & silk',
                    },
                    {
                        label: 'Kurta',
                        href: category('Kurta'),
                        description: 'Relaxed & refined',
                    },
                    {
                        label: 'Fatua',
                        href: category('Fatua'),
                        description: 'Casual comfort',
                    },
                ],
            },
        ],
    },
    { label: 'Accessories', href: category('Accessories') },
    {
        label: 'New Arrivals',
        href: shop.products.index.url({ query: { sort: 'newest' } }),
    },
    {
        label: 'Sale',
        href: shop.products.index.url({ query: { sale: 1 } }),
        highlight: true,
    },
];
