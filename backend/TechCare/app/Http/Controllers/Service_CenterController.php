<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service_Center;
use Illuminate\Support\Facades\Storage;

class Service_CenterController extends Controller
{
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
        $service_center->load('ratings', 'services');

        return response()->json($service_center);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service_Center $service_center)
    {
        $validated = $request->validate([
            'name_service_center' => 'sometimes|required|string|max:64',
            'deskripsi_service_center' => 'sometimes|required|string|max:255',
            'status_service_center' => 'sometimes|required|in:buka,tutup',
            'foto_service_center' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('foto_service_center')) {
            // Delete the old image from the server so you don't waste storage space
            if ($service_center->foto_service_center) {
                Storage::disk('public')->delete($service_center->foto_service_center);
            }
            
            // Store the new image
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
