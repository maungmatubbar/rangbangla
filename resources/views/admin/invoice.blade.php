<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invoice {{ $order->order_number }}</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 40px; }
        .wrap { max-width: 720px; margin: 0 auto; }
        .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 16px; margin-bottom: 24px; }
        .brand { font-size: 24px; font-weight: 700; }
        .brand small { display: block; font-size: 11px; letter-spacing: 3px; color: #6d28d9; }
        .muted { color: #666; font-size: 13px; }
        h1 { font-size: 18px; margin: 0; }
        .cols { display: flex; gap: 40px; margin-bottom: 24px; }
        .cols > div { flex: 1; }
        .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; border-bottom: 1px solid #ddd; padding: 8px 0; }
        td { padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        td.right, th.right { text-align: right; }
        .totals { margin-left: auto; width: 240px; }
        .totals div { display: flex; justify-content: space-between; padding: 6px 0; }
        .totals .grand { font-weight: 700; font-size: 16px; border-top: 2px solid #111; margin-top: 6px; padding-top: 10px; }
        .pill { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
        .paid { background: #dcfce7; color: #166534; }
        .unpaid { background: #fef3c7; color: #92400e; }
        .foot { margin-top: 40px; font-size: 12px; color: #888; text-align: center; }
        @media print { body { padding: 0; } .noprint { display: none; } }
    </style>
</head>
<body>
<div class="wrap">
    <div class="noprint" style="text-align:right;margin-bottom:12px;">
        <button onclick="window.print()" style="padding:8px 16px;border:0;border-radius:8px;background:#6d28d9;color:#fff;cursor:pointer;">Print / Save PDF</button>
    </div>

    <div class="head">
        <div class="brand">Rangbangla<small>রংবাংলা</small></div>
        <div style="text-align:right;">
            <h1>INVOICE</h1>
            <div class="muted">{{ $order->order_number }}</div>
            <div class="muted">{{ $order->created_at?->format('d M Y') }}</div>
            <span class="pill {{ $order->payment_status === 'paid' ? 'paid' : 'unpaid' }}">{{ ucfirst($order->payment_status) }}</span>
        </div>
    </div>

    <div class="cols">
        <div>
            <div class="label">Billed to</div>
            <div><strong>{{ $order->customer_name ?? $order->user?->name }}</strong></div>
            <div class="muted">{{ $order->phone }}</div>
            <div class="muted">{{ collect([$order->address, $order->city, $order->district, $order->postcode])->filter()->implode(', ') }}</div>
        </div>
        <div>
            <div class="label">Payment</div>
            <div class="muted">Method: {{ strtoupper($order->payment_method ?? 'COD') }}</div>
            <div class="muted">Status: {{ ucfirst($order->payment_status) }}</div>
            <div class="muted">Order status: {{ $order->status->label() }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th class="right">Qty</th>
                <th class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($order->items as $item)
                <tr>
                    <td>
                        {{ $item->product_name }}
                        @if ($item->variant_label)
                            <div class="muted">{{ $item->variant_label }}</div>
                        @endif
                    </td>
                    <td class="right">{{ $item->quantity }}</td>
                    <td class="right">{{ $item->formatted_line_total }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <div><span>Subtotal</span><span>{{ $order->formatted_subtotal }}</span></div>
        @if ($order->discount > 0)
            <div><span>Discount{{ $order->coupon_code ? ' (' . $order->coupon_code . ')' : '' }}</span><span>-{{ $order->formatted_discount }}</span></div>
        @endif
        <div><span>Delivery</span><span>Cash on Delivery</span></div>
        <div class="grand"><span>Total</span><span>{{ $order->formatted_total }}</span></div>
    </div>

    <div class="foot">Thank you for shopping with Rangbangla · রংবাংলা</div>
</div>
</body>
</html>
