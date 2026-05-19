<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;

class PaymentController extends Controller
{
    /**
     * Generate Midtrans Snap Token for Frontend
     */
    public function getSnapToken(Request $request)
    {
        // 1. Validate incoming request
        $validated = $request->validate([
            'id_order' => 'required|exists:orders,id_order',
        ]);

        // 2. Find the order with its service and user details
        $order = Order::with(['service', 'user'])->find($request->id_order);

        // 3. Extract the exact price from the service
        $totalHarga = $order->service->harga_service;

        // 4. Set Midtrans Configuration
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = env('MIDTRANS_IS_SANITIZED', true);
        Config::$is3ds = env('MIDTRANS_IS_3DS', true);

        // 5. Build the Midtrans Transaction Payload
        $params = [
            'transaction_details' => [
                // We add time() so Midtrans sees a unique Order ID every time you test
                'order_id' => 'ORDER-' . $order->id_order . '-' . time(), 
                'gross_amount' => (int) $totalHarga, // Midtrans requires an integer here!
            ],
            'customer_details' => [
                'first_name' => $order->user->name ?? 'Customer',
                'email' => $order->user->email ?? 'customer@example.com',
            ]
        ];

        // 6. Get the token from Midtrans
        try {
            $snapToken = Snap::getSnapToken($params);
            
            return response()->json([
                'message' => 'Payment token generated successfully!',
                'snap_token' => $snapToken,
                'client_key' => env('MIDTRANS_CLIENT_KEY') 
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate Snap token',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function handleNotification(Request $request)
    {
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);

        try {
            $notif = new Notification();
            $transactionStatus = $notif->transaction_status;
            $type = $notif->payment_type;
            $midtransOrderId = $notif->order_id; 

            $parts = explode('-', $midtransOrderId);
            $trueOrderId = $parts[1] ?? null; 

            $order = Order::find($trueOrderId);
            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            if ($transactionStatus == 'settlement' || $transactionStatus == 'capture') {
                Payment::updateOrCreate(
                    ['id_order' => $order->id_order],
                    [
                        'jumlah_pembayaran' => $notif->gross_amount,
                        'metode_pembayaran' => $type,
                    ]
                );
                $order->update(['status_order' => 'in_progress']);
            } elseif ($transactionStatus == 'pending') {
                $order->update(['status_order' => 'pending']);
            } elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
                $order->update(['status_order' => 'pending']); 
            }

            return response()->json(['message' => 'Notification handled successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

