<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validate the incoming data from React Native
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Look for the user in the database
        $user = User::where('email', $request->email)->first();

        // 3. If user doesn't exist OR the password doesn't match, reject them
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials. Please check your email and password.'
            ], 401);
        }

        // 4. Generate the Sanctum token
        // We name the token 'react_native_app' so you know where it came from in the database
        $token = $user->createToken('react_native_app')->plainTextToken;

        // 5. Return the user info and the crucial token back to the frontend
        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function loginMitra(Request $request)
    {
        // 1. Validate the incoming request
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Find the Mitra by their email
        $mitra = \App\Models\Mitra::where('email', $request->email)->first();

        // 3. Check if Mitra exists AND if the password matches the hashed password
        if (!$mitra || !\Illuminate\Support\Facades\Hash::check($request->password, $mitra->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // 4. Create the Token
        $token = $mitra->createToken('mitra-token')->plainTextToken;

        return response()->json([
            'message' => 'Mitra Login Successful',
            'token' => $token,
            'mitra' => $mitra
        ]);
    }
}