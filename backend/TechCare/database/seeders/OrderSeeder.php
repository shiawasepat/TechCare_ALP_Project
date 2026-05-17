<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;
use App\Models\Service;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Fetch all available users and services as collections
        $users = User::all();
        $services = Service::all();

        // 2. Safety Check: If tables are empty, abort and warn the terminal
        if ($users->isEmpty() || $services->isEmpty()) {
            $this->command->warn('⚠️ Skipping OrderSeeder: No Users or Services found. Did their seeders run first?');
            return;
        }

        // 3. Create a 'Pending' Order
        // Grab the very first user and first service available
        Order::create([
            'id_service' => $services->first()->id_service,
            'id_user' => $users->first()->id_user,
            'status_order' => 'pending',
        ]);

        // 4. Create a 'Completed' Order
        // Mix it up by using the last user in the database
        Order::create([
            'id_service' => $services->first()->id_service,
            'id_user' => $users->last()->id_user,
            'status_order' => 'completed',
        ]);
        
        // 5. Create an 'In Progress' Order
        // Use the last service available
        Order::create([
            'id_service' => $services->last()->id_service,
            'id_user' => $users->first()->id_user,
            'status_order' => 'in_progress',
        ]);

        // 6. Success message so you know it worked!
        $this->command->info('✅ Orders seeded successfully!');
    }
}