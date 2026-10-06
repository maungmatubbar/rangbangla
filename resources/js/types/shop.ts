export type ProductImage = {
    url: string;
    is_primary: boolean;
    position: number;
};

export type ProductVariant = {
    id: number;
    sku: string | null;
    size: string | null;
    color: string | null;
    color_hex: string | null;
    label: string;
    price: number;
    formatted_price: string;
    stock: number;
    in_stock: boolean;
};

export type ProductColor = {
    color: string;
    color_hex: string | null;
};

export type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    formatted_price: string;
    compare_at_price: number | null;
    formatted_compare_at_price: string | null;
    discount_percent: number;
    on_sale: boolean;
    is_new: boolean;
    currency: string;
    stock: number;
    in_stock: boolean;
    category: string | null;
    sku: string | null;
    sizes?: string[];
    colors?: ProductColor[];
    variants?: ProductVariant[];
    wishlisted?: boolean;
    images: ProductImage[];
    created_at: string | null;
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links?: { url: string | null; label: string; active: boolean }[];
};

export type ProductFilters = {
    q: string;
    category: string;
    size: string;
    color: string;
    min: string | null;
    max: string | null;
    sort: string;
    sale: boolean;
};

export type CartLine = {
    variant_id: number;
    product_id: number;
    name: string;
    slug: string;
    variant_label: string;
    size: string | null;
    color: string | null;
    color_hex: string | null;
    image: string | null;
    unit_price: number;
    formatted_unit_price: string;
    original_unit_price: number;
    formatted_original_unit_price: string;
    on_sale: boolean;
    quantity: number;
    stock: number;
    line_total: number;
    formatted_line_total: string;
};

export type AppliedCoupon = {
    code: string;
    label: string;
    discount: number;
    formatted_discount: string;
};

export type CartSummary = {
    lines: CartLine[];
    subtotal: number;
    formatted_subtotal: string;
    discount: number;
    formatted_discount: string;
    total: number;
    formatted_total: string;
    coupon: AppliedCoupon | null;
    count: number;
};

export type Address = {
    id: number;
    label: string | null;
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postcode: string | null;
    is_default: boolean;
};

export type OrderStatus =
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'completed'
    | 'cancelled';

export type OrderReturn = {
    id: number;
    status: string;
    status_label: string;
    reason: string;
    admin_note: string | null;
    created_at: string | null;
};

export type TrackingStep = { value: string; label: string };

export type OrderItem = {
    id: number;
    product_id: number;
    product_variant_id: number | null;
    product_name: string;
    variant_label: string | null;
    variant_size: string | null;
    variant_color: string | null;
    unit_price: number;
    quantity: number;
    line_total: number;
    formatted_line_total: string;
};

export type Order = {
    id: number;
    order_number: string;
    status: OrderStatus;
    status_label: string;
    subtotal: number;
    formatted_subtotal: string;
    discount: number;
    formatted_discount: string;
    coupon_code: string | null;
    total: number;
    formatted_total: string;
    currency: string;
    payment_status: string;
    tracking_number: string | null;
    customer_name: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    district: string | null;
    postcode: string | null;
    payment_method: string | null;
    shipping_note: string | null;
    items: OrderItem[];
    completed_at: string | null;
    created_at: string | null;
};

export type OrderListItem = {
    id: number;
    order_number: string;
    status: OrderStatus;
    status_label: string;
    formatted_total: string;
    items_count: number;
    created_at: string | null;
};
