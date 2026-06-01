<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Carbon\Carbon;
use App\Models\Payment;

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
        $query = Order::with([
            'user:id_user,name',
            'service:id_service,id_service_center,nama_service,harga_service',
            'service.serviceCenter:id_service_center,lokasi_service_center,jarak_service_center,name_service_center',
        ])
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

public function getTodayEarnings(Request $request)
{
    // 1. Get the currently logged-in Mitra & their Service Center
    $user = $request->user();
    $serviceCenter = $user->serviceCenter; 

    if (!$serviceCenter) {
        return response()->json(['message' => 'Service center not found for this user.'], 404);
    }

    $today = Carbon::today();

    // 2. Fetch today's payments that belong to this Mitra's Service Center
    // We use nested relationship querying: Payment -> belongsTo -> Order -> belongsTo -> Service
    $payments = Payment::whereHas('order.service', function ($query) use ($serviceCenter) {
            $query->where('id_service_center', $serviceCenter->id_service_center); 
        })
        ->with('order') // Eager load the order so we can see the 'tipe_order'
        ->whereDate('created_at', $today) 
        ->get();

    // 3. Calculate total earnings directly from the payment rows
    $totalEarnings = $payments->sum('jumlah_pembayaran');

    // 4. Calculate type breakdowns by looking inside the related order
    $homeServiceCount = $payments->where('order.tipe_order', 'home_service')->count();
    $reservasiCount = $payments->where('order.tipe_order', 'reservasi')->count();

    // 5. Return the clean aggregated metrics
    return response()->json([
        'message' => 'Today earnings summary fetched successfully from payments history',
        'date' => $today->toDateString(),
        'total_money_made' => $totalEarnings,
        'total_transactions_today' => $payments->count(),
        'breakdown' => [
            'home_service' => $homeServiceCount,
            'reservasi' => $reservasiCount,
        ]
    ], 200);
}

    // untuk technician. look for orders that are still pending and unassigned (id_technician is null)
    public function getTechnicianOrders(Request $request)
    {
        $technician = $request->user();
        
        // This will be 'New', 'in_progress', 'completed', or null (for ALL)
        $requestedTab = $request->query('status'); 

        // 1. Base query: only orders belonging to their specific workshop
        $query = Order::with(['user:id_user,name', 'service:id_service,nama_service'])
            ->whereHas('service', function ($q) use ($technician) {
                $q->where('id_service_center', $technician->id_service_center);
            });

        // 2. Filter logic based on which Tab they clicked in React Native
        if ($requestedTab === 'pending') {
            // "New" Tab: Orders that are pending AND nobody has claimed them yet
            $query->where('status_order', 'pending')
                  ->whereNull('id_technician');
                  
        } elseif ($requestedTab === 'in_progress' || $requestedTab === 'completed') {
            // "In Progress" & "Completed" Tabs: MUST be assigned to THIS specific technician
            $query->where('status_order', $requestedTab)
                  ->where('id_technician', $technician->id_technician);
                  
        } else {
            // "ALL" Tab: Show the Pool (unassigned) + Their own assigned jobs
            $query->where(function ($q) use ($technician) {
                $q->whereNull('id_technician')
                  ->orWhere('id_technician', $technician->id_technician);
            });
        }

        $orders = $query->latest()->get();

        return response()->json([
            'message' => 'Technician orders fetched successfully',
            'orders' => $orders
        ], 200);
    }

    public function claimOrder(Request $request, Order $order)
    {
        $technician = $request->user();

        // 1. Check if it's already taken or not pending
        if ($order->status_order !== 'pending' || $order->id_technician !== null) {
            return response()->json([
                'message' => 'This order is no longer available or already claimed.'
            ], 400);
        }

        // 2. Security: Ensure the order belongs to this technician's service center
        if ($order->service->id_service_center !== $technician->id_service_center) {
            return response()->json([
                'message' => 'Unauthorized. This order belongs to a different service center.'
            ], 403);
        }

        // 3. Update the database (Status + Technician ID)
        $order->status_order = 'in_progress';
        $order->id_technician = $technician->id_technician;
        $order->save();

        return response()->json([
            'message' => 'Order claimed successfully!',
            'order' => $order
        ], 200);
    }

    public function completeOrder(Request $request, Order $order)
    {
        $technician = $request->user();

        // 1. Security: Ensure THIS exact technician is the one who claimed it
        if ($order->id_technician !== $technician->id_technician) {
            return response()->json([
                'message' => 'Unauthorized. You cannot complete an order claimed by someone else.'
            ], 403);
        }

        // 2. Check if it is actually in progress
        if ($order->status_order !== 'in_progress') {
            return response()->json([
                'message' => 'Only orders that are in_progress can be completed.'
            ], 400);
        }

        // 3. Update the status
        $order->status_order = 'completed';
        $order->save();

        return response()->json([
            'message' => 'Order completed successfully!',
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
