<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReturnRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReturnController extends Controller
{
    public function index(Request $request): Response
    {
        $status = (string) $request->query('status', '');

        $returns = ReturnRequest::query()
            ->with(['order', 'user'])
            ->when($status !== '', fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (ReturnRequest $return): array => [
                'id' => $return->id,
                'order_number' => $return->order?->order_number,
                'order_id' => $return->order_id,
                'customer' => $return->user?->name,
                'status' => $return->status,
                'status_label' => $return->status_label,
                'reason' => $return->reason,
                'admin_note' => $return->admin_note,
                'created_at' => $return->created_at,
            ]);

        return Inertia::render('admin/returns/index', [
            'returns' => $returns,
            'filters' => ['status' => $status],
            'statuses' => ReturnRequest::STATUSES,
        ]);
    }

    public function update(Request $request, ReturnRequest $returnRequest): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:'.implode(',', ReturnRequest::STATUSES)],
            'admin_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $returnRequest->update([
            'status' => $data['status'],
            'admin_note' => $data['admin_note'] ?? $returnRequest->admin_note,
            'resolved_at' => in_array($data['status'], ['approved', 'rejected', 'completed'], true) ? now() : null,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Return request updated.']);

        return back();
    }
}
