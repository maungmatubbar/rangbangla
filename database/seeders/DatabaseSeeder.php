<?php

namespace Database\Seeders;

use App\Actions\Orders\CreateOrder;
use App\Enums\OrderStatus;
use App\Models\Product;
use App\Models\ReturnRequest;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Admin account (email + password login).
        User::updateOrCreate(
            ['email' => 'admin@rangbangla.com'],
            [
                'name' => 'Rangbangla Admin',
                'password' => 'password',
                'is_admin' => true,
                'email_verified_at' => now(),
            ],
        );

        // A demo customer.
        $customer = User::updateOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test Customer', 'password' => 'password', 'email_verified_at' => now()],
        );

        $this->call(ProductSeeder::class);
        $this->call(CouponSeeder::class);

        $this->seedDemoOrders($customer);
    }

    private function seedDemoOrders(User $customer): void
    {
        if ($customer->orders()->exists()) {
            return;
        }

        $createOrder = app(CreateOrder::class);
        $variants = Product::query()
            ->with('variants')
            ->get()
            ->flatMap(fn (Product $product) => $product->variants->where('stock', '>', 0))
            ->values();

        if ($variants->isEmpty()) {
            return;
        }

        $statuses = [OrderStatus::Pending, OrderStatus::Processing, OrderStatus::Shipped, OrderStatus::Completed];

        foreach ($statuses as $index => $status) {
            $variant = $variants[$index % $variants->count()];

            $order = $createOrder->handle($customer, [
                ['variant_id' => $variant->id, 'quantity' => 1],
            ], [
                'customer_name' => $customer->name,
                'phone' => '01700000000',
                'address' => 'House 7, Road 2, Banani',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
                'postcode' => '1213',
                'payment_method' => 'cod',
            ]);

            $order->update([
                'status' => $status,
                'payment_status' => in_array($status, [OrderStatus::Shipped, OrderStatus::Completed], true) ? 'paid' : 'unpaid',
                'paid_at' => in_array($status, [OrderStatus::Shipped, OrderStatus::Completed], true) ? now() : null,
                'completed_at' => $status === OrderStatus::Completed ? now() : null,
                'tracking_number' => in_array($status, [OrderStatus::Shipped, OrderStatus::Completed], true) ? 'RB'.fake()->numerify('########') : null,
            ]);

            if ($status === OrderStatus::Completed) {
                ReturnRequest::create([
                    'order_id' => $order->id,
                    'user_id' => $customer->id,
                    'status' => 'requested',
                    'reason' => 'Size did not fit as expected, would like to exchange.',
                ]);
            }
        }
    }
}
