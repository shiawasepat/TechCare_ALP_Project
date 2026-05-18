<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;
use App\Models\Service;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Fetch available users and services
        $users = User::all();
        $services = Service::all();

        // 2. Safety Check to prevent silent skipping
        if ($users->isEmpty() || $services->isEmpty()) {
            $this->command->error('🚨 Skipping OrderSeeder: No Users or Services found in the database!');
            return;
        }

        // 3. Order 1: On-site Reservation (Pending)
        Order::create([
            'id_service'          => $services->first()->id_service,
            'id_user'             => $users->first()->id_user,
            'tipe_order'          => 'reservasi',
            'waktu_reservasi'     => Carbon::now()->addDays(2)->setTime(10, 0, 0), // Scheduled for 2 days from now at 10:00 AM
            'alamat_home_service' => null,
            'status_order'        => 'pending',
        ]);

        // 4. Order 2: Home Service (In Progress)
        Order::create([
            'id_service'          => $services->first()->id_service,
            'id_user'             => $users->last()->id_user,
            'tipe_order'          => 'home_service',
            'waktu_reservasi'     => null,
            'alamat_home_service' => 'Jl. Kemang Raya No. 45, Blok C, Jakarta Selatan',
            'status_order'        => 'in_progress',
        ]);

        // 5. Order 3: On-site Reservation (Completed)
        Order::create([
            'id_service'          => $services->last()->id_service,
            'id_user'             => $users->first()->id_user,
            'tipe_order'          => 'reservasi',
            'waktu_reservasi'     => Carbon::now()->subDays(1)->setTime(14, 30, 0), // Was scheduled yesterday at 2:30 PM
            'alamat_home_service' => null,
            'status_order'        => 'completed',
        ]);

        $this->command->info('✅ Orders with Type Options seeded successfully!');
    }
}