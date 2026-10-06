<?php

namespace App\Exceptions;

use RuntimeException;

class InsufficientStockException extends RuntimeException
{
    public static function for(string $productName, int $requested, int $available): self
    {
        return new self(
            "Insufficient stock for \"{$productName}\": requested {$requested}, only {$available} available."
        );
    }
}
