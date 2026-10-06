import { cn } from '@/lib/utils';

export type ChartPoint = { label: string; value: number };

/** A responsive gradient area chart (no dependencies). */
export function AreaChart({
    data,
    className,
}: {
    data: ChartPoint[];
    className?: string;
}) {
    const W = 600;
    const H = 240;
    const padL = 12;
    const padR = 12;
    const padT = 16;
    const padB = 28;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const n = data.length;
    const max = Math.max(...data.map((d) => d.value), 1);
    const baseline = padT + plotH;

    const x = (i: number) =>
        n <= 1 ? padL + plotW / 2 : padL + (i * plotW) / (n - 1);
    const y = (v: number) => padT + plotH * (1 - v / max);

    const line = data
        .map(
            (d, i) =>
                `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`,
        )
        .join(' ');
    const area =
        `M ${x(0).toFixed(1)} ${baseline} ` +
        data
            .map((d, i) => `L ${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`)
            .join(' ') +
        ` L ${x(n - 1).toFixed(1)} ${baseline} Z`;

    const labelEvery = Math.max(1, Math.ceil(n / 5));

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className={cn('w-full text-primary', className)}
            role="img"
            aria-label="Area chart"
        >
            <defs>
                <linearGradient
                    id="admin-area-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >
                    <stop
                        offset="0"
                        stopColor="currentColor"
                        stopOpacity="0.3"
                    />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
            </defs>

            {[0, 0.5, 1].map((t) => (
                <line
                    key={t}
                    x1={padL}
                    x2={W - padR}
                    y1={padT + plotH * t}
                    y2={padT + plotH * t}
                    className="stroke-border"
                    strokeWidth="1"
                />
            ))}

            <path d={area} fill="url(#admin-area-fill)" />
            <path
                d={line}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {data.map((d, i) =>
                i % labelEvery === 0 || i === n - 1 ? (
                    <circle
                        key={`dot-${i}`}
                        cx={x(i)}
                        cy={y(d.value)}
                        r="3.5"
                        className="fill-background stroke-primary"
                        strokeWidth="2"
                    />
                ) : null,
            )}

            {data.map((d, i) =>
                i % labelEvery === 0 || i === n - 1 ? (
                    <text
                        key={`lbl-${i}`}
                        x={x(i)}
                        y={H - 8}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[10px]"
                    >
                        {d.label}
                    </text>
                ) : null,
            )}
        </svg>
    );
}

export type DonutSegment = { label: string; value: number; color: string };

/** A donut chart with legend. */
export function DonutChart({
    segments,
    unit = 'orders',
}: {
    segments: DonutSegment[];
    unit?: string;
}) {
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    const size = 180;
    const stroke = 24;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    let offset = 0;

    return (
        <div className="flex flex-wrap items-center gap-6">
            <div className="relative size-40 shrink-0">
                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    className="size-40 -rotate-90"
                >
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        className="stroke-muted"
                        strokeWidth={stroke}
                    />
                    {segments.map((seg) => {
                        const len = (seg.value / (total || 1)) * c;
                        const el = (
                            <circle
                                key={seg.label}
                                cx={size / 2}
                                cy={size / 2}
                                r={r}
                                fill="none"
                                stroke={seg.color}
                                strokeWidth={stroke}
                                strokeDasharray={`${len} ${c - len}`}
                                strokeDashoffset={-offset}
                            />
                        );
                        offset += len;
                        return el;
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold">{total}</span>
                    <span className="text-xs text-muted-foreground">
                        {unit}
                    </span>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-2">
                {segments.map((seg) => (
                    <div
                        key={seg.label}
                        className="flex items-center gap-2 text-sm"
                    >
                        <span
                            className="size-2.5 rounded-full"
                            style={{ background: seg.color }}
                        />
                        <span className="text-muted-foreground">
                            {seg.label}
                        </span>
                        <span className="ml-auto font-medium">{seg.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Horizontal bars with gradient fill. */
export function BarList({ items }: { items: ChartPoint[] }) {
    const max = Math.max(...items.map((i) => i.value), 1);

    if (items.length === 0) {
        return (
            <p className="py-6 text-center text-sm text-muted-foreground">
                No data yet.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {items.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-muted-foreground">
                            {item.value}
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="bg-lime h-full rounded-full"
                            style={{ width: `${(item.value / max) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
