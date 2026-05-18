<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Mitra;
use Illuminate\Support\Facades\Hash;

class MitraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Mitra::create([
            'email' => 'joko@mitra.com',
            'password' => Hash::make('password123'),
        ]);

        Mitra::create([
            'email' => 'agus@mitra.com',
            'password' => Hash::make('password123'),
        ]);

        Mitra::create([
            'email' => 'gadgetdoc@mitra.com',
            'password' => Hash::make('password123'),
        ]);
    }
}
