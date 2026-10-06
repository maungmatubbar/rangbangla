<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('type')->default('percent')->comment('percent | fixed');
            $table->unsignedInteger('value')->comment('Percent (1-100) or fixed amount in poisha.');
            $table->unsignedInteger('min_order')->nullable()->comment('Minimum subtotal in poisha.');
            $table->unsignedInteger('max_discount')->nullable()->comment('Cap for percent coupons, in poisha.');
            $table->unsignedInteger('usage_limit')->nullable()->comment('Max total redemptions.');
            $table->unsignedInteger('used_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
