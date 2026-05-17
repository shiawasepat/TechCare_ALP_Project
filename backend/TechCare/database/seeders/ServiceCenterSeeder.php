<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service_Center;
use App\Models\Mitra;

class ServiceCenterSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch our seeded Mitras
        $mitra1 = Mitra::find(1);
        $mitra2 = Mitra::find(2);
        $mitra3 = Mitra::find(3);

        if ($mitra1) {
            Service_Center::create([
                'id_mitra' => $mitra1->id_mitra,
                'name_service_center' => 'TechCare Hub Jakarta',
                'deskripsi_service_center' => 'Pusat perbaikan gadget kilat khusus iPhone, iPad, dan Macbook dengan suku cadang premium.',
                'lokasi_service_center' => 'Jl. Mangga Dua Raya No. 12, Jakarta Pusat',
                'status_service_center' => 'buka',
                'foto_service_center' => 'service_centers/placeholder1.jpg', // Looks clean if you put dummy files in storage later
            ]);
        }

        if ($mitra2) {
            Service_Center::create([
                'id_mitra' => $mitra2->id_mitra,
                'name_service_center' => 'FixIt Gadget Studio',
                'deskripsi_service_center' => 'Spesialis menangani laptop mati total, ganti keyboard, re-pasta, dan upgrade hardware laptop gaming.',
                'lokasi_service_center' => 'Jl. Margonda Raya No. 45, Depok',
                'status_service_center' => 'buka',
                'foto_service_center' => 'service_centers/placeholder2.jpg',
            ]);
        }

        if ($mitra3) {
            Service_Center::create([
                'id_mitra' => $mitra3->id_mitra,
                'name_service_center' => 'Doctor Gadget Surabaya',
                'deskripsi_service_center' => 'Menerima perbaikan segala jenis smartphone Android, ganti LCD, kaca pecah, dan ganti baterai.',
                'lokasi_service_center' => 'Jl. Raya Darmo No. 88, Surabaya',
                'status_service_center' => 'tutup', // Untuk test filter tutup
                'foto_service_center' => null,
            ]);
        }
    }
}