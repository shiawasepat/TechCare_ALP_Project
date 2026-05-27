<?php

use App\Models\Chats;
use Illuminate\Support\Facades\Broadcast;

// Use Sanctum for broadcasting auth (API clients won't have a web login route).
Broadcast::routes(['middleware' => ['auth:sanctum']]);

// Ensure only the order owner, owning mitra, or assigned technician can listen
Broadcast::channel('chat.{id_chats}', function ($user, $id_chats) {
    $chat = Chats::with('order.service.serviceCenter')->find($id_chats);

    if (!$chat || !$chat->order) {
        return false;
    }

    $order = $chat->order;
    $ownerMitraId = $order->service?->serviceCenter?->id_mitra;

    $isCustomer = $user->id_user !== null && $user->id_user === $order->id_user;
    $isMitra = $user->id_mitra !== null && $ownerMitraId !== null && $user->id_mitra === $ownerMitraId;

    $isTechnician = false;
    if ($order->id_technician !== null) {
        $isTechnician = $user->id_technician !== null && $user->id_technician === $order->id_technician;
    }

    return $isCustomer || $isMitra || $isTechnician;
}, ['guards' => ['sanctum']]); // <-- Crucial: Tells the channel to use your token auth