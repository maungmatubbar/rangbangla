<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\Otp\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class PhoneAuthController extends Controller
{
    public function __construct(private readonly OtpService $otp) {}

    /**
     * Send a login OTP to a phone number.
     */
    public function sendOtp(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'phone' => ['required', 'string', 'regex:/^01\d{9}$/'],
        ], [
            'phone.regex' => 'Enter a valid Bangladeshi number, e.g. 01712345678.',
        ]);

        $phone = OtpService::normalize($data['phone']);
        $isNew = ! User::where('phone', $phone)->exists();

        $code = $this->otp->send($phone, 'login');

        return back()->with('otp', [
            'sent' => true,
            'phone' => $phone,
            'is_new' => $isNew,
            'debug' => $this->otp->shouldReveal() ? $code : null,
        ]);
    }

    /**
     * Verify the OTP and log the user in, creating an account when new.
     */
    public function login(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'phone' => ['required', 'string', 'regex:/^01\d{9}$/'],
            'code' => ['required', 'string', 'size:6'],
            'name' => ['nullable', 'string', 'max:255'],
        ]);

        $phone = OtpService::normalize($data['phone']);

        if (! $this->otp->verify($phone, $data['code'], 'login')) {
            throw ValidationException::withMessages([
                'code' => 'The code is invalid or has expired.',
            ]);
        }

        $user = User::where('phone', $phone)->first();

        if ($user === null) {
            if (blank($data['name'] ?? null)) {
                throw ValidationException::withMessages([
                    'name' => 'Please enter your name to create an account.',
                ]);
            }

            $user = User::create([
                'name' => $data['name'],
                'phone' => $phone,
            ]);
        }

        $user->forceFill(['phone_verified_at' => now()])->save();

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()->intended(route('home'));
    }
}
