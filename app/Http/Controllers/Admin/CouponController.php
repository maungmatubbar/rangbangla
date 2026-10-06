<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Support\Money;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function index(): Response
    {
        $coupons = Coupon::query()
            ->latest()
            ->get()
            ->map(fn (Coupon $coupon): array => $this->serialize($coupon));

        return Inertia::render('admin/coupons/index', [
            'coupons' => $coupons,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Coupon::create($this->validated($request));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Coupon created.']);

        return back();
    }

    public function update(Request $request, Coupon $coupon): RedirectResponse
    {
        // A request without a code is a lightweight active/inactive toggle.
        if (! $request->has('code')) {
            $coupon->update(['is_active' => $request->boolean('is_active')]);

            return back();
        }

        $coupon->update($this->validated($request, $coupon));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Coupon updated.']);

        return back();
    }

    public function destroy(Coupon $coupon): RedirectResponse
    {
        $coupon->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Coupon deleted.']);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Coupon $coupon = null): array
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:40', 'regex:/^[A-Za-z0-9_-]+$/', Rule::unique('coupons', 'code')->ignore($coupon?->id)],
            'type' => ['required', Rule::in([Coupon::TYPE_PERCENT, Coupon::TYPE_FIXED])],
            'value' => ['required', 'numeric', 'min:1'],
            'min_order' => ['nullable', 'numeric', 'min:0'],
            'max_discount' => ['nullable', 'numeric', 'min:0'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'expires_at' => ['nullable', 'date'],
            'is_active' => ['boolean'],
        ]);

        $toMinor = fn (mixed $v): ?int => ($v === null || $v === '')
            ? null
            : (int) round(((float) $v) * 100);

        $data['code'] = mb_strtoupper(trim($data['code']));
        $data['value'] = $data['type'] === Coupon::TYPE_FIXED
            ? (int) round(((float) $data['value']) * 100)
            : min(100, (int) round((float) $data['value']));
        $data['min_order'] = $toMinor($data['min_order'] ?? null);
        $data['max_discount'] = $data['type'] === Coupon::TYPE_PERCENT
            ? $toMinor($data['max_discount'] ?? null)
            : null;
        $data['is_active'] = $data['is_active'] ?? true;

        return $data;
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(Coupon $coupon): array
    {
        return [
            'id' => $coupon->id,
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'label' => $coupon->label(),
            'min_order_label' => $coupon->min_order !== null ? Money::format($coupon->min_order) : null,
            'max_discount_label' => $coupon->max_discount !== null ? Money::format($coupon->max_discount) : null,
            'usage_limit' => $coupon->usage_limit,
            'used_count' => $coupon->used_count,
            'expires_at' => $coupon->expires_at?->toDateString(),
            'is_active' => $coupon->is_active,
        ];
    }
}
