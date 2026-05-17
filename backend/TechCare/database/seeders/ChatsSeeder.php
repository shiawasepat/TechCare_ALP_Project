<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Chats;
use App\Models\Order;

class ChatsSeeder extends Seeder
{
    public function run(): void
    {
        // Grab our seeded orders
        $order1 = Order::find(1);
        $order2 = Order::find(2);

        if ($order1) {
            Chats::create([
                'id_order' => $order1->id_order,
            ]);
        }

        if ($order2) {
            Chats::create([
                'id_order' => $order2->id_order,
            ]);
        }
    }
}