<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('account/addresses', [
            'addresses' => $request->user()->addresses()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['is_default'] = ($data['is_default'] ?? false) || $request->user()->addresses()->count() === 0;

        if ($data['is_default']) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $request->user()->addresses()->create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Address saved.']);

        return back();
    }

    public function update(Request $request, Address $address): RedirectResponse
    {
        abort_unless($address->user_id === $request->user()->id, 403);

        $data = $this->validated($request);
        $data['is_default'] = $data['is_default'] ?? false;

        if ($data['is_default']) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Address updated.']);

        return back();
    }

    public function destroy(Request $request, Address $address): RedirectResponse
    {
        abort_unless($address->user_id === $request->user()->id, 403);

        $address->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Address removed.']);

        return back();
    }

    public function setDefault(Request $request, Address $address): RedirectResponse
    {
        abort_unless($address->user_id === $request->user()->id, 403);

        $request->user()->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'label' => ['nullable', 'string', 'max:40'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:120'],
            'district' => ['required', 'string', 'max:120'],
            'postcode' => ['nullable', 'string', 'max:16'],
            'is_default' => ['boolean'],
        ]);
    }
}
