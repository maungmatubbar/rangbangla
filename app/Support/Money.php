<?php

namespace App\Support;

/**
 * Formats monetary amounts stored as integer minor units.
 *
 * Rangbangla prices are stored in poisha (1 BDT = 100 poisha) and rendered
 * as Bangladeshi Taka, e.g. 650000 => "৳6,500".
 */
class Money
{
    public const CURRENCY = 'BDT';

    public const SYMBOL = '৳';

    /**
     * @return non-falsy-string
     */
    public static function format(int $minor): string
    {
        return self::SYMBOL.number_format($minor / 100, 0);
    }
}
