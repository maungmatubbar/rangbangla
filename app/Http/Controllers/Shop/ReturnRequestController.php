<?php

namespace App\Http\Controllers\Shop;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ReturnRequestController extends Controller
{
    public function store(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        if ($order->status !== OrderStatus::Completed) {
            throw ValidationException::withMessages([
                'reason' => 'You can only request a return for a delivered order.',
            ]);
        }

        if ($order->returnRequests()->whereIn('status', ['requested', 'approved'])->exists()) {
            throw ValidationException::withMessages([
                'reason' => 'A return request for this order is already in progress.',
            ]);
        }

        $data = $request->validate([
            'reason' => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        $order->returnRequests()->create([
            'user_id' => $request->user()->id,
            'status' => 'requested',
            'reason' => $data['reason'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Return request submitted.']);

        return back();
    }
}
