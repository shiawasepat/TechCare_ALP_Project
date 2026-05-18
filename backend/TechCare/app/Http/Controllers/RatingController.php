<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;


class RatingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ratings = Rating::all();
        return response()->json([
            'message' => 'Ratings retrieved successfully',
            'ratings' => $ratings
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_service_center' => 'required|exists:service_centers,id_service_center',
            'nilai_rating' => 'required|integer|min:1|max:5',
            'kesan' => 'nullable|string|max:255',
        ]);

        $validated['id_user'] = $request->user()->id_user;


        $rating = Rating::create($validated);
        return response()->json([
            'message' => 'Rating created successfully',
            'rating' => $rating
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Rating $rating)
    {
        return response()->json($rating);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rating $rating)
    {
    // no edit untuk rating
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rating $rating)
    {
        // no delete untuk rating
    }
}
