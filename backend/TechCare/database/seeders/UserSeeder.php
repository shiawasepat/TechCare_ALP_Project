<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@user.com',
            'password' => Hash::make('password'),
            'contact' => '081234567890',
        ]);

        User::create([
            'name' => 'Siti Aminah',
            'email' => 'siti@user.com',
            'password' => Hash::make('password'),
            'contact' => '081234567890',
        ]);

        User::create([
            'name' => 'Andi Wijaya',
            'contact' => '085544332211',
            'email' => 'andi@user.com',
            'password' => Hash::make('password'),
        ]);
    }
}