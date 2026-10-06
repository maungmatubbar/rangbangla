<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Orders\CompleteOrder;
use App\Actions\Orders\CreateOrder;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    /**
     * create_order — POST /api/v1/orders
     */
    public function store(StoreOrderRequest $request, CreateOrder $createOrder): JsonResponse
    {
        $order = $createOrder->handle($request->user(), $request->items());

        return OrderResource::make($order->load('items'))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * get_order — GET /api/v1/orders/{order}   (authorized via the `can:view` route middleware)
     */
    public function show(Order $order): OrderResource
    {
        return OrderResource::make($order->load('items'));
    }

    /**
     * complete_order — POST /api/v1/orders/{order}/complete   (authorized via `can:complete`)
     */
    public function complete(Order $order, CompleteOrder $completeOrder): OrderResource
    {
        return OrderResource::make($completeOrder->handle($order)->load('items'));
    }
}
