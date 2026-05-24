<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::updateOrCreate(
            ['email' => 'admin@techcare.com'], // The unique identifier
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123'), // Securely hashed password
            ]
        );
    }
}