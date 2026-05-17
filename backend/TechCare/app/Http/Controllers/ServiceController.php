<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return response()->json([
            'message' => 'Services retrieved successfully',
            'services' => $services
        ]);
    }

public function store(Request $request)
    {
        // no need id
        $validated = $request->validate([
            'nama_service' => 'required|string|max:255',
            'deskripsi_service' => 'required|string|max:255',
            'harga_service' => 'required|numeric|min:0', 
        ]);

        
        $mitra = $request->user(); 
        // check if mitra adaji service center, if not return error
        if (!$mitra->serviceCenter) {
            return response()->json([
                'message' => 'System Error: did not have service center or smtng'
            ], 422); 
        }

        //Find the Service Center that belongs to this Mitra
        $serviceCenter = $mitra->serviceCenter;


        $validated['id_service_center'] = $serviceCenter->id_service_center;

        $service = Service::create($validated);
        
        return response()->json([
            'message' => 'Service created successfully and assigned to your center!',
            'service' => $service
        ], 201);
    }

    public function show(Service $service)
    {
        return response()->json($service);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'nama_service' => 'sometimes|required|string|max:255',
            'deskripsi_service' => 'sometimes|required|string|max:255',
            'harga_service' => 'sometimes|required|numeric|min:0',
        ]);

        $service->update($validated);
        
        return response()->json([
            'message' => 'Service updated successfully',
            'service' => $service
        ]);
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return response()->json(null, 204);
    }
}