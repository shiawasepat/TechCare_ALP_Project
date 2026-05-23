<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Order;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        // Load the order AND its related service so we can see the true price
        $order1 = Order::with('service')->find(1);
        $order2 = Order::with('service')->find(2);

        if ($order1 && $order1->service) {
            Payment::create([
                'id_order' => $order1->id_order,
                // Automatically grab the true catalog price!
                'jumlah_pembayaran' => $order1->service->harga_service, 
                'metode_pembayaran' => 'gopay',
            ]);
        }

        if ($order2 && $order2->service) {
            Payment::create([
                'id_order' => $order2->id_order,
                // Automatically grab the true catalog price!
                'jumlah_pembayaran' => $order2->service->harga_service,
                'metode_pembayaran' => 'cash',
            ]);
        }
    }
}