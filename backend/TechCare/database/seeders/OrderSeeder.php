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

        // 6. Order 4: Home Service (Pending)
        Order::create([
            'id_service'          => $services[1]->id_service ?? $services->first()->id_service,
            'id_user'             => $users[1]->id_user ?? $users->first()->id_user,
            'tipe_order'          => 'home_service',
            'waktu_reservasi'     => null,
            'alamat_home_service' => 'Jl. Sudirman No. 123, Jakarta Pusat',
            'status_order'        => 'pending',
        ]);

        // 7. Order 5: On-site Reservation (In Progress)
        Order::create([
            'id_service'          => $services[2]->id_service ?? $services->last()->id_service,
            'id_user'             => $users->last()->id_user,
            'tipe_order'          => 'reservasi',
            'waktu_reservasi'     => Carbon::now()->addDays(1)->setTime(15, 0, 0),
            'alamat_home_service' => null,
            'status_order'        => 'in_progress',
        ]);

        // 8. Order 6: Home Service (Completed)
        Order::create([
            'id_service'          => $services->first()->id_service,
            'id_user'             => $users[2]->id_user ?? $users->first()->id_user,
            'tipe_order'          => 'home_service',
            'waktu_reservasi'     => null,
            'alamat_home_service' => 'Jl. Fatmawati No. 56, Jakarta Selatan',
            'status_order'        => 'completed',
        ]);

        // 9. Order 7: On-site Reservation (Pending)
        Order::create([
            'id_service'          => $services->last()->id_service,
            'id_user'             => $users[1]->id_user ?? $users->first()->id_user,
            'tipe_order'          => 'reservasi',
            'waktu_reservasi'     => Carbon::now()->addDays(3)->setTime(11, 30, 0),
            'alamat_home_service' => null,
            'status_order'        => 'pending',
        ]);

        // 10. Order 8: Home Service (In Progress)
        Order::create([
            'id_service'          => $services[1]->id_service ?? $services->first()->id_service,
            'id_user'             => $users->first()->id_user,
            'tipe_order'          => 'home_service',
            'waktu_reservasi'     => null,
            'alamat_home_service' => 'Jl. Blok M No. 78, Jakarta Selatan',
            'status_order'        => 'in_progress',
        ]);

        // 11. Order 9: On-site Reservation (Completed)
        Order::create([
            'id_service'          => $services->first()->id_service,
            'id_user'             => $users->last()->id_user,
            'tipe_order'          => 'reservasi',
            'waktu_reservasi'     => Carbon::now()->subDays(2)->setTime(9, 0, 0),
            'alamat_home_service' => null,
            'status_order'        => 'completed',
        ]);

        // 12. Order 10: Home Service (Pending)
        Order::create([
            'id_service'          => $services->last()->id_service,
            'id_user'             => $users[2]->id_user ?? $users->first()->id_user,
            'tipe_order'          => 'home_service',
            'waktu_reservasi'     => null,
            'alamat_home_service' => 'Jl. Gatot Subroto No. 99, Jakarta Selatan',
            'status_order'        => 'pending',
        ]);

        // 13. Order 11: On-site Reservation (In Progress)
        Order::create([
            'id_service'          => $services[2]->id_service ?? $services->first()->id_service,
            'id_user'             => $users[1]->id_user ?? $users->first()->id_user,
            'tipe_order'          => 'reservasi',
            'waktu_reservasi'     => Carbon::now()->addDays(1)->setTime(16, 45, 0),
            'alamat_home_service' => null,
            'status_order'        => 'in_progress',
        ]);

        // 14. Order 12: Home Service (Completed)
        Order::create([
            'id_service'          => $services->first()->id_service,
            'id_user'             => $users->first()->id_user,
            'tipe_order'          => 'home_service',
            'waktu_reservasi'     => null,
            'alamat_home_service' => 'Jl. Menteng No. 34, Jakarta Pusat',
            'status_order'        => 'completed',
        ]);

        $this->command->info('✅ Orders with Type Options seeded successfully!');
    }
}