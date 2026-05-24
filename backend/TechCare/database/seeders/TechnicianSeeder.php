<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Technician;
use Illuminate\Support\Facades\Hash;

class TechnicianSeeder extends Seeder
{
    public function run(): void
    {
        Technician::create([
            'id_service_center' => 1,
            'name' => 'Budi Technician',
            'email' => 'budi@tech.com',
            'password' => Hash::make('password123'),
        ]);

        Technician::create([
            'id_service_center' => 2,
            'name' => 'Siti Mechanic',
            'email' => 'siti@tech.com',
            'password' => Hash::make('password123'),
        ]);

        Technician::create([
            'id_service_center' => 1,
            'name' => 'Andi Engineer',
            'email' => 'andi@tech.com',
            'password' => Hash::make('password123'),
        ]);

        Technician::create([
            'id_service_center' => 3,
            'name' => 'Dewi Specialist',
            'email' => 'dewi@tech.com',
            'password' => Hash::make('password123'),
        ]);

        Technician::create([
            'id_service_center' => 2,
            'name' => 'Rudi Expert',
            'email' => 'rudi@tech.com',
            'password' => Hash::make('password123'),
        ]);

        Technician::create([
            'id_service_center' => 3,
            'name' => 'Maya Operator',
            'email' => 'maya@tech.com',
            'password' => Hash::make('password123'),
        ]);

        
    }
}