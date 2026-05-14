<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mitra;

class MitraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mitras = Mitra::all();
        return response()->json([
            'message' => 'Mitra retrieved successfully',
            'mitras' => $mitras
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
     {
         $validated = $request->validate([
             'email' => 'required|string|email|max:255|unique:mitras',
             'password' => 'required|string|min:8',

         ]);

         $mitra = Mitra::create($validated);
         return response()->json([
             'message' => 'Mitra created successfully',
             'mitra' => $mitra
         ], 201);
     }
    
        //
    

    /**
     * Display the specified resource.
     */
    public function show(Mitra $mitra)
    {
        return response()->json($mitra);
    }
        //

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Mitra $mitra)
    {
        $validated = $request->validate([
            'email' => 'sometimes|required|string|email|max:255|unique:mitras',
            'password' => 'sometimes|required|string|min:8',
        ]);

        $mitra->update($validated);
        return response()->json([
            'message' => 'Mitra updated successfully',
            'mitra' => $mitra
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mitra $mitra)
    {
        $mitra->delete();
        return response()->json(null, 204);
    }
}
