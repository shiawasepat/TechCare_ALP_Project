<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;

class PaymentController extends Controller
{
    /**
     * Simulate a successful payment gateway response
     */
    public function simulatePayment(Request $request)
    {
        // 1. Validate incoming request
        $validated = $request->validate([
            'id_order' => 'required|exists:orders,id_order',
            'metode_pembayaran' => 'required|string|in:gopay,ovo,dana,cash',
        ]);

        // 2. Find the order and its associated service to get the price
        $order = Order::with('service')->find($request->id_order);

        // 3. Extract the price directly from the service
        $totalHarga = $order->service->harga_service;

        // 4. Create the Mock Payment Record
        $payment = Payment::create([
            'id_order' => $order->id_order,
            'jumlah_pembayaran' => $totalHarga, // Auto-calculated!
            'metode_pembayaran' => $validated['metode_pembayaran'],
        ]);

        return response()->json([
            'message' => 'Payment processed successfully via Mock Gateway!',
            'status' => 'completed', // Midtrans uses 'settlement' for successful transactions
            'payment_details' => $payment
        ], 201);
    }
}