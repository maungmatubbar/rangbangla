<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'WELCOME10',
                'type' => Coupon::TYPE_PERCENT,
                'value' => 10,
                'min_order' => null,
                'max_discount' => null,
            ],
            [
                'code' => 'FESTIVE15',
                'type' => Coupon::TYPE_PERCENT,
                'value' => 15,
                'min_order' => 200000, // ৳2,000
                'max_discount' => 100000, // cap ৳1,000
            ],
            [
                'code' => 'EID500',
                'type' => Coupon::TYPE_FIXED,
                'value' => 50000, // ৳500 off
                'min_order' => 300000, // ৳3,000
                'max_discount' => null,
            ],
        ];

        foreach ($coupons as $coupon) {
            Coupon::updateOrCreate(['code' => $coupon['code']], [
                ...$coupon,
                'is_active' => true,
            ]);
        }
    }
}
