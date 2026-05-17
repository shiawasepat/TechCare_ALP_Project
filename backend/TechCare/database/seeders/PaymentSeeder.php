<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Order; // We need this to link the payment to a real order

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        // Search order id
        $order1 = Order::find(1);
        $order2 = Order::find(2);

        // We use if() checks just in case the orders haven't been seeded yet!
        if ($order1) {
            Payment::create([
                'id_order' => $order1->id_order,
                'jumlah_pembayaran' => 150000.00,
                'metode_pembayaran' => 'gopay', // Must be 'cash', 'ovo', 'gopay', or 'dana'
            ]);
        }

        if ($order2) {
            Payment::create([
                'id_order' => $order2->id_order,
                'jumlah_pembayaran' => 55000.00,
                'metode_pembayaran' => 'cash',
            ]);
        }
    }
}