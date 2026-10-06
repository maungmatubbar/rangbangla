/**
 * Fixed page backdrop: a subtle graph-paper grid with a soft brand-coloured
 * aurora glow near the top. Sits behind all storefront content.
 */
export function SiteBackground() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 bg-background"
        >
            <div className="bg-grid absolute inset-0" />
            <div className="bg-brand-spotlight absolute inset-0" />
        </div>
    );
}
