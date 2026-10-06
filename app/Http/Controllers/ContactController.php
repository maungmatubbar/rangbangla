<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('contact');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:40'],
            'subject' => ['required', 'string', 'max:160'],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        // Integration point: no mail/CRM gateway is wired up yet — this mirrors
        // the log-based OTP delivery (see App\Support\Otp\OtpService::deliver()).
        // Swap this line for a Mailable, a stored ContactMessage model, or a
        // CRM webhook to route enquiries to the support inbox.
        Log::info('Contact enquiry received', $data);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Thanks for reaching out, {$data['name']} — we'll reply within 24 hours.",
        ]);

        return back();
    }
}
