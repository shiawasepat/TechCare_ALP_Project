<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\Service_Center;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Grab the first two service centers to give them menu items/services
        $center1 = Service_Center::find(1);
        $center2 = Service_Center::find(2);

        // Services for Service Center 1
        if ($center1) {
            Service::create([
                'id_service_center' => $center1->id_service_center,
                'nama_service' => 'Reservasi: Bersihkan fan',
                'deskripsi_service' => 'Perbaikan kaca pecah atau LCD bergaris menggunakan suku cadang berkualitas tinggi.',
                'harga_service' => 450000.00,
            ]);

            Service::create([
                'id_service_center' => $center1->id_service_center,
                'nama_service' => 'Home Service: Ganti Paste',
                'deskripsi_service' => 'Mengatasi baterai kembung atau drop dengan garansi selama 3 bulan.',
                'harga_service' => 250000.00,
            ]);
        }

        // Services for Service Center 2
        if ($center2) {
            Service::create([
                'id_service_center' => $center2->id_service_center,
                'nama_service' => 'Home service: Ganti paste',
                'deskripsi_service' => 'Pengecekan IC Power dan komponen mesin utama akibat korsleting atau jatuh.',
                'harga_service' => 750000.00,
            ]);

            Service::create([
                'id_service_center' => $center2->id_service_center,
                'nama_service' => 'Reservasi: Pembersihan Kipas & Ganti Thermal Paste Laptop',
                'deskripsi_service' => 'Mengurangi overheat pada laptop agar performa kembali stabil.',
                'harga_service' => 150000.00,
            ]);
        }
    }
}