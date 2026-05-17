<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rating;
use App\Models\User;
use App\Models\Service_Center;

class RatingSeeder extends Seeder
{
    public function run(): void
    {
        // Grab the test users and service centers we created in previous seeders
        $user1 = User::find(1); // Budi Santoso
        $user2 = User::find(2); // Siti Aminah
        
        $center1 = Service_Center::find(1); // TechCare Hub Jakarta
        $center2 = Service_Center::find(2); // FixIt Gadget Studio

        // --- Reviews for Service Center 1 ---
        // Let's give Center 1 a 5-star and a 1-star review to test our exact 3.0 average logic!
        if ($user1 && $center1) {
            Rating::create([
                'id_service_center' => $center1->id_service_center,
                'id_user' => $user1->id_user,
                'nilai_rating' => 5,
                'kesan' => 'Mantap',
            ]);
        }

        if ($user2 && $center1) {
            Rating::create([
                'id_service_center' => $center1->id_service_center,
                'id_user' => $user2->id_user,
                'nilai_rating' => 1,
                'kesan' => 'Antreannya panjang sekali dan pengerjaannya kurang rapi.',
            ]);
        }

        // --- Reviews for Service Center 2 ---
        if ($user1 && $center2) {
            Rating::create([
                'id_service_center' => $center2->id_service_center,
                'id_user' => $user1->id_user,
                'nilai_rating' => 4,
                'kesan' => 'Dingin kalo main game, tapi harganya agak mahal.',
            ]);
        }
    }
}