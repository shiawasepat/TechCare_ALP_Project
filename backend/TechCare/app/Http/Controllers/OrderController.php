<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    

    /**
     * Store a newly created resource in storage.
     */
public function store(Request $request)
{
    // Validate incoming data from frontend
    $validated = $request->validate([
        'id_service'          => 'required|exists:services,id_service',
        'tipe_order'          => 'required|in:reservasi,home_service',
        
        // 'required_if' means: if type is home_service, they MUST provide an address!
        'alamat_home_service' => 'required_if:tipe_order,home_service|string|nullable',
        'waktu_reservasi'     => 'required_if:tipe_order,reservasi|date|nullable',
    ]);

    $user = $request->user();
    $validated['id_user'] = $user->id_user;

    $order = Order::create($validated);
    $order->load(['service', 'user']);

    return response()->json([
        'message' => 'Order placed successfully!',
        'order' => $order
    ], 201);
}

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        // When viewing an order, load its payment status, service details, and chat!
        $order->load(['service', 'payment', 'chat']);
        
        return response()->json($order);
    }

    // filter by status order untuk mitra
    public function getMitraOrders(Request $request)
    {
        // 1. Get the requested tab status from the URL (e.g., ?status=completed)
        $requestedStatus = $request->query('status');

        // 2. Get the logged-in Mitra
        $mitra = $request->user();

        // 3. Find only the orders that belong to THIS Mitra's Service Center
        $query = Order::with(['user', 'service'])
            ->whereHas('service', function ($query) use ($mitra) {
                // Here is the magic: We look up the Mitra's Service Center ID!
                $query->where('id_service_center', $mitra->serviceCenter->id_service_center); 
            });

        // 4. If the React Native app clicked a specific tab, filter the list
        if ($requestedStatus) {
            $query->where('status_order', $requestedStatus);
        }

        // 5. Fetch the results, newest first
        $orders = $query->latest()->get();

        return response()->json([
            'message' => 'Orders fetched successfully',
            'orders' => $orders
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // no update untuk order
    }


    // khusus update status order untuk mitra, karena hanya mitra yang bisa update status order
    public function updateStatus(Request $request, Order $order)
    {
        // Validate that they are only sending allowed statuses
        $validated = $request->validate([
            'status_order' => 'required|in:pending,in_progress,completed'
        ]);

        // Update the order (This works safely now because you added it to $fillable!)
        $order->update([
            'status_order' => $validated['status_order']
        ]);

        return response()->json([
            'message' => 'Order status updated successfully!',
            'order' => $order
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // same case
    }
}
