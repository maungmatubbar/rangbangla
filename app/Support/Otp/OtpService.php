<?php

namespace App\Support\Otp;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Generates and verifies one-time passwords for phone-based flows.
 *
 * Delivery is pluggable: in local/dev the code is logged (and surfaced to the
 * UI) so it can be tested without an SMS gateway. Swap send() for a real SMS
 * provider (Twilio, SSLWireless, bKash SMS, …) in production.
 */
class OtpService
{
    private const TTL = 300; // 5 minutes

    /**
     * Generate, store and "send" an OTP for a phone + purpose.
     *
     * @return string The generated code (so callers can reveal it in dev).
     */
    public function send(string $phone, string $purpose = 'login'): string
    {
        $phone = self::normalize($phone);
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        Cache::put($this->key($phone, $purpose), $code, self::TTL);

        $this->deliver($phone, $code, $purpose);

        return $code;
    }

    public function verify(string $phone, string $code, string $purpose = 'login'): bool
    {
        $phone = self::normalize($phone);
        $stored = Cache::get($this->key($phone, $purpose));

        if ($stored === null || ! hash_equals((string) $stored, trim($code))) {
            return false;
        }

        Cache::forget($this->key($phone, $purpose));

        return true;
    }

    /**
     * Whether the code should be returned to the UI (local/testing only).
     */
    public function shouldReveal(): bool
    {
        return app()->environment(['local', 'testing']);
    }

    /**
     * Canonicalise a Bangladeshi phone number to 01XXXXXXXXX form.
     */
    public static function normalize(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone) ?? '';

        if (str_starts_with($digits, '880')) {
            $digits = '0'.substr($digits, 3);
        }

        if (strlen($digits) === 10 && str_starts_with($digits, '1')) {
            $digits = '0'.$digits;
        }

        return $digits;
    }

    private function deliver(string $phone, string $code, string $purpose): void
    {
        // TODO: integrate a real SMS gateway here.
        Log::info("[OTP] {$purpose} code for {$phone}: {$code}");
    }

    private function key(string $phone, string $purpose): string
    {
        return "otp:{$purpose}:{$phone}";
    }
}
