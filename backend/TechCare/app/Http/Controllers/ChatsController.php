<?php

namespace App\Http\Controllers;

use App\Models\Chats;
use App\Models\Message;
use App\Models\Order;
use Illuminate\Http\Request;

class ChatsController extends Controller
{
    /**
     * 1. GET ALL MESSAGES IN A CHAT ROOM
     * Loaded automatically with the sender details (User or Mitra)
     */
    public function show(Order $order)
    {
        // Find the chat room for this specific order, or create it if it doesn't exist yet
        $chat = Chats::firstOrCreate([
            'id_order' => $order->id_order
        ]);

        // Fetch the chat room along with all messages and their respective senders
        $chat->load(['messages.sender']);

        return response()->json([
            'message' => 'Chat room loaded successfully',
            'chat' => $chat
        ], 200);
    }

    /**
     * 2. SEND A NEW MESSAGE
     * Works seamlessly for both Users and Mitras using Sanctum Auth
     */
    public function sendMessage(Request $request, Order $order)
    {
        // Validate incoming text
        $validated = $request->validate([
            'pesan' => 'required|string|max:1000'
        ]);

        // Find or create the chat room for this order
        $chat = Chats::firstOrCreate([
            'id_order' => $order->id_order
        ]);

        // Grab whoever is currently logged in (User or Mitra model instance)
        $sender = $request->user();

        // Save the message using Laravel's polymorphic save relation
        $message = new Message([
            'id_chats' => $chat->id_chats,
            'pesan' => $validated['pesan']
        ]);

        // This magic method automatically sets 'sender_id' and 'sender_type' 
        // using the class type of whoever is logged in (e.g., App\Models\User or App\Models\Mitra)
        $message->sender()->associate($sender);
        $message->save();

        // Load the sender info right away so the frontend can display it instantly
        $message->load('sender');

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message
        ], 201);
    }
}