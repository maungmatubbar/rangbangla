<?php

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\ReturnRequest;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;

function admin(): User
{
    return User::factory()->create(['is_admin' => true]);
}

it('denies guests and customers from the admin panel', function () {
    $this->get('/admin')->assertRedirect('/login');

    $this->actingAs(User::factory()->create())->get('/admin')->assertForbidden();
    $this->actingAs(User::factory()->create())->get('/admin/products')->assertForbidden();
});

it('shows the admin dashboard to admins', function () {
    $this->actingAs(admin())->get('/admin')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/dashboard')
            ->has('stats')
            ->has('recentOrders'));
});

it('creates and updates a product', function () {
    $admin = admin();

    $this->actingAs($admin)->post('/admin/products', [
        'name' => 'Handloom Cotton Saree',
        'description' => 'A lovely handloom cotton saree for everyday wear.',
        'price' => 2500,
        'category' => 'Saree',
        'is_active' => true,
    ])->assertRedirect();

    $product = Product::where('name', 'Handloom Cotton Saree')->firstOrFail();
    expect($product->price)->toBe(250000); // taka -> poisha

    $this->actingAs($admin)->put("/admin/products/{$product->id}", [
        'name' => 'Handloom Cotton Saree',
        'description' => 'Updated description here for the saree.',
        'price' => 3000,
        'category' => 'Saree',
        'is_active' => false,
    ])->assertRedirect();

    expect($product->fresh()->price)->toBe(300000);
    expect($product->fresh()->is_active)->toBeFalse();
});

it('uploads and removes a product image', function () {
    Storage::fake('public');
    $admin = admin();
    $product = Product::factory()->create();

    $this->actingAs($admin)->post("/admin/products/{$product->id}/images", [
        'image' => UploadedFile::fake()->image('saree.jpg'),
    ])->assertRedirect();

    $image = $product->images()->firstOrFail();
    expect($image->is_primary)->toBeTrue();
    Storage::disk('public')->assertExists($image->path);

    $this->actingAs($admin)->delete("/admin/products/{$product->id}/images/{$image->id}")->assertRedirect();
    expect($product->images()->count())->toBe(0);
});

it('adds, updates and removes a variant and syncs stock', function () {
    $admin = admin();
    $product = Product::factory()->create();

    $this->actingAs($admin)->post("/admin/products/{$product->id}/variants", [
        'size' => 'M',
        'color' => 'Maroon',
        'color_hex' => '#7B1E3B',
        'stock' => 20,
        'is_active' => true,
    ])->assertRedirect();

    $variant = $product->variants()->firstOrFail();
    expect($product->fresh()->stock)->toBe(20);

    $this->actingAs($admin)->put("/admin/products/{$product->id}/variants/{$variant->id}", [
        'size' => 'M',
        'color' => 'Maroon',
        'stock' => 5,
        'is_active' => true,
    ])->assertRedirect();
    expect($variant->fresh()->stock)->toBe(5);
    expect($product->fresh()->stock)->toBe(5);

    $this->actingAs($admin)->delete("/admin/products/{$product->id}/variants/{$variant->id}")->assertRedirect();
    expect($product->variants()->count())->toBe(0);
});

it('updates order status and payment', function () {
    $admin = admin();
    $order = Order::factory()->for(User::factory())->create();

    $this->actingAs($admin)->patch("/admin/orders/{$order->id}", [
        'status' => OrderStatus::Shipped->value,
        'payment_status' => 'paid',
        'tracking_number' => 'RB12345678',
    ])->assertRedirect();

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::Shipped);
    expect($order->payment_status)->toBe('paid');
    expect($order->paid_at)->not->toBeNull();
    expect($order->tracking_number)->toBe('RB12345678');
});

it('renders an invoice', function () {
    $admin = admin();
    $order = Order::factory()->for(User::factory())->hasItems(1)->create();

    $this->actingAs($admin)->get("/admin/orders/{$order->id}/invoice")
        ->assertOk()
        ->assertSee($order->order_number);
});

it('lists customers and shows customer detail', function () {
    $admin = admin();
    $customer = User::factory()->create();
    Order::factory()->for($customer)->create();

    $this->actingAs($admin)->get('/admin/customers')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('admin/customers/index'));

    $this->actingAs($admin)->get("/admin/customers/{$customer->id}")
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/customers/show')
            ->where('customer.id', $customer->id)
            ->has('orders', 1));
});

it('updates a return request', function () {
    $admin = admin();
    $customer = User::factory()->create();
    $order = Order::factory()->for($customer)->create();
    $return = ReturnRequest::factory()->create([
        'order_id' => $order->id,
        'user_id' => $customer->id,
    ]);

    $this->actingAs($admin)->patch("/admin/returns/{$return->id}", [
        'status' => 'approved',
        'admin_note' => 'Approved — please ship the item back.',
    ])->assertRedirect();

    $return->refresh();
    expect($return->status)->toBe('approved');
    expect($return->resolved_at)->not->toBeNull();
});
