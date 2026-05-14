<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service_Center;

class Service_CenterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $service_centers = Service_Center::all();
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
            'id_mitra' => 'required|exists:mitras,id_mitra|unique:service_centers,id_mitra',
            'id_service' => 'nullable|exists:services,id_service',
            'id_rating' => 'nullable|exists:ratings,id_rating',
            'name_service_center' => 'required|string|max:64',
            'deskripsi_service_center' => 'required|string|max:255',
            'lokasi_service_center' => 'required|string|max:255',
            'status_service_center' => 'required|in:buka,tutup',
            'foto_service_center' => 'nullable|string',
        ]);

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
        return response()->json($service_center);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service_Center $service_center)
    {
        $validated = $request->validate([
            'nama_service_center' => 'sometimes|required|string|max:64',
            'deskripsi_service_center' => 'sometimes|required|string|max:255',
            'status_service_center' => 'sometimes|required|in:buka,tutup',
            'foto_service_center' => 'nullable|string',
        ]);

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
        $service_center->delete();
        return response()->json(null, 204);
    }
}
