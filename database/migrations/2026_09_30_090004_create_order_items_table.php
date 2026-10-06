<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained();
            $table->foreignId('product_variant_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name')->comment('Snapshot of the product name at purchase time.');
            $table->string('variant_label')->nullable()->comment('Snapshot of the variant, e.g. "M / Maroon".');
            $table->string('variant_size')->nullable();
            $table->string('variant_color')->nullable();
            $table->unsignedInteger('unit_price')->comment('Snapshot of the unit price in poisha.');
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('line_total')->comment('unit_price * quantity, in poisha.');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
