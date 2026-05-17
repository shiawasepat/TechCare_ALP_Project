<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Message;
use App\Models\Chats;
use App\Models\User;
use App\Models\Mitra;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        // Grab our dependencies
        $chat1 = Chats::find(1);
        $user1 = User::find(1);
        $mitra1 = Mitra::find(1);

        // Let's seed a real conversation inside Chat 1
        if ($chat1 && $user1 && $mitra1) {
            
            // 1. User sends a message
            Message::create([
                'id_chats' => $chat1->id_chats,
                'sender_id' => $user1->id_user,
                'sender_type' => User::class, // Stores "App\Models\User" automatically
                'pesan' => 'lokasi dimana?',
            ]);

            // 2. Mitra responds
            Message::create([
                'id_chats' => $chat1->id_chats,
                'sender_id' => $mitra1->id_mitra,
                'sender_type' => Mitra::class, // Stores "App\Models\Mitra" automatically
                'pesan' => 'Halo, permisi. teknisi kami sedang dalam perjalanan menuju lokasi Anda, mohon ditunggu ya.',
            ]);

            // 3. User replies back
            Message::create([
                'id_chats' => $chat1->id_chats,
                'sender_id' => $user1->id_user,
                'sender_type' => User::class,
                'pesan' => 'Baik kak, terima kasih informasinya',
            ]);
        }
    }
}