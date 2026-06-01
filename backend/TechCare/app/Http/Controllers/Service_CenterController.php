<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service_Center;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class Service_CenterController extends Controller
{
    private function publicStorageUrl(Request $request, ?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        return rtrim($request->getSchemeAndHttpHost(), '/') . '/storage/' . ltrim($path, '/');
    }

    /**
     * Display a listing of the resource.
     */
public function index()
    {
        // Tell the database to count the ratings and calculate the average for us
        $service_centers = Service_Center::where('status_service_center', 'buka')
            ->withCount('ratings') // This creates a 'ratings_count' field
            ->withAvg('ratings', 'nilai_rating') // This creates a 'ratings_avg_rating' field
            ->get();

        // Loop through and format the numbers nicely
        $service_centers->each(function ($center) {
            // Round to 1 decimal point, or default to 0 if there are no ratings yet
                $center->ratings_avg_nilai_rating = $center->ratings_avg_nilai_rating 
                ? round($center->ratings_avg_nilai_rating, 1) 
                : 0.0;
        });

        return response()->json([
            'message' => 'Service Centers retrieved successfully',
            'service_centers' => $service_centers
        ]);
    }

    /**
     * Get the authenticated Mitra's Service Center Profile
     */
    public function myProfile(Request $request)
    {
        // 1. Find the service center belonging to the logged-in Mitra token
        $service_center = Service_Center::where('id_mitra', $request->user()->id_mitra)->first();
        

        if (!$service_center) {
            return response()->json(['message' => 'Service Center profile not found.'], 404);
        }

        // 2. Dynamic Time Checking Logic
        if ($service_center->open_time && $service_center->close_time) {
            $now = Carbon::now();
            
            // Convert the DB strings ("10:00") into actual Time Objects for accurate math
            $openTime = Carbon::parse($service_center->open_time);
            $closeTime = Carbon::parse($service_center->close_time);
            
            $isOpen = false;
            
            if ($openTime->lessThan($closeTime)) {
                $isOpen = $now->between($openTime, $closeTime);
            } 
            else {
                $isOpen = $now->greaterThanOrEqualTo($openTime) || $now->lessThanOrEqualTo($closeTime);
            }




            $calculatedStatus = $isOpen ? 'buka' : 'tutup';

            // Auto-update database if the status shifted since last check
            if ($service_center->status_service_center !== $calculatedStatus) {
                $service_center->status_service_center = $calculatedStatus;
                $service_center->save();
            }
        }

        // 4. Return the required data
        return response()->json([
            'message' => 'Profile retrieved successfully',
            'service_center' => [
                'id_service_center' => $service_center->id_service_center,
                'name_service_center' => $service_center->name_service_center,
                'status_service_center' => $service_center->status_service_center,
                'lokasi_service_center' => $service_center->lokasi_service_center,
                'open_time' => $service_center->open_time,
                'close_time' => $service_center->close_time,
                'foto_service_center' => $this->publicStorageUrl($request, $service_center->foto_service_center),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_service' => 'nullable|exists:services,id_service',
            'id_rating' => 'nullable|exists:ratings,id_rating',
            'name_service_center' => 'required|string|max:64',
            'deskripsi_service_center' => 'required|string|max:255',
            'lokasi_service_center' => 'required|string|max:255',
            'jarak_service_center' => 'required|float|min:0',
            'status_service_center' => 'required|in:buka,tutup',
            'foto_service_center' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',

        ]);

        $validated['id_mitra'] = $request->user()->id_mitra;

        if ($request->hasFile('foto_service_center')) {
            // This saves the file to storage/app/public/service_centers and returns the path
            $path = $request->file('foto_service_center')->store('service_centers', 'public');
            $validated['foto_service_center'] = $path;
        }

        $service_center = Service_Center::create($validated);
        return response()->json([
            'message' => 'Service Center created successfully',
            'service_center' => $service_center
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Service_Center $service_center)
    {
        $service_center->load('ratings', 'services')
            ->loadCount('ratings')
            ->loadAvg('ratings', 'nilai_rating');

        $service_center->ratings_avg_nilai_rating = $service_center->ratings_avg_nilai_rating
            ? round($service_center->ratings_avg_nilai_rating, 1)
            : 0.0;

        return response()->json($service_center);
    }

    /**
     * Update the specified resource in storage.
     */
/**
     * Update the specified resource in storage.
     */
public function update(Request $request, Service_Center $service_center)
    {
        // SECURITY CHECK
        if ($service_center->id_mitra !== $request->user()->id_mitra) {
            return response()->json([
                'message' => 'Forbidden. You cannot modify a service center that does not belong to you.'
            ], 403);
        }

        $validated = $request->validate([
            'name_service_center' => 'sometimes|required|string|max:64',
            'lokasi_service_center' => 'sometimes|required|string|max:255', 
            'deskripsi_service_center' => 'sometimes|required|string|max:255',
            'jarak_service_center' => 'sometimes|required|numeric|min:0',
            'open_time' => 'sometimes|required|date_format:H:i',  
            'close_time' => 'sometimes|required|date_format:H:i', 
            'foto_service_center' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('foto_service_center')) {
            if ($service_center->foto_service_center) {
                Storage::disk('public')->delete($service_center->foto_service_center);
            }
            $path = $request->file('foto_service_center')->store('service_centers', 'public');
            $validated['foto_service_center'] = $path;
        }

        $service_center->update($validated);
        
        return response()->json([
            'message' => 'Service Center updated successfully',
            'service_center' => $service_center
        ]);
    }

/**
     * Update the authenticated Mitra's Service Center Profile
     */
    public function updateProfile(Request $request)
    {
        // 1. Find the shop belonging to this specific token
        $service_center = Service_Center::where('id_mitra', $request->user()->id_mitra)->first();

        if (!$service_center) {
            return response()->json(['message' => 'Service Center profile not found.'], 404);
        }

        // 2. Validate incoming data (using 'sometimes' so they can update just one field if they want)
        $validated = $request->validate([
            'name_service_center' => 'sometimes|required|string|max:64',
            'lokasi_service_center' => 'sometimes|required|string|max:255',
            'deskripsi_service_center' => 'sometimes|required|string|max:255',
            'open_time' => 'sometimes|required|date_format:H:i',  // Validates standard 24h format like "10:00"
            'close_time' => 'sometimes|required|date_format:H:i', // Validates standard 24h format like "22:00"
            'foto_service_center' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // 3. Handle image replacement if a new image is uploaded
        if ($request->hasFile('foto_service_center')) {
            if ($service_center->foto_service_center) {
                Storage::disk('public')->delete($service_center->foto_service_center);
            }
            $path = $request->file('foto_service_center')->store('service_centers', 'public');
            $validated['foto_service_center'] = $path;
        }

        // 4. Update the database record
        $service_center->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully!',
            'service_center' => [
                'id_service_center' => $service_center->id_service_center,
                'name_service_center' => $service_center->name_service_center,
                'status_service_center' => $service_center->status_service_center,
                'lokasi_service_center' => $service_center->lokasi_service_center,
                'open_time' => $service_center->open_time,
                'close_time' => $service_center->close_time,
                'foto_service_center' => $this->publicStorageUrl($request, $service_center->foto_service_center),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service_Center $service_center)
    {
        // Optional: Delete the image when the service center is deleted
        if ($service_center->foto_service_center) {
            Storage::disk('public')->delete($service_center->foto_service_center);
        }

        $service_center->delete();
        return response()->json(null, 204);
    }
}
