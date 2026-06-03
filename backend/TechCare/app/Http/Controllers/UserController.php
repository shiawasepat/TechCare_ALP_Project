<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return response()->json([
            'message' => 'Users retrieved successfully',
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:64|min:3',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'contact' => 'required|string|max:20',
            'foto_user' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $validated['password'] = bcrypt($validated['password']);

        if ($request->hasFile('foto_user')) {
        $path = $request->file('foto_user')->store('profiles', 'public');
        $validated['foto_user'] = $path;
    }

        $user = User::create($validated);

        $token = $user->createToken('react_native_app')->plainTextToken;
        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:64|min:3',
            'foto_user' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('foto_user')) {
        if ($user->foto_user) {
            Storage::disk('public')->delete($user->foto_user);
        }
        $path = $request->file('foto_user')->store('profiles', 'public');
        $validated['foto_user'] = $path;
    }

        $user->update($validated);
        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    public function login(Request $request)
{
    // 1. Validate the incoming request data
    $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    // 2. Find the user by their email
    $user = User::where('email', $request->email)->first();

    // 3. Check if user exists and the password matches the hashed password in DB
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Bad credentials. Check your email or password again.'
        ], 401);
    }

    // 4. Create a fresh Sanctum token for this login session
    $token = $user->createToken('react_native_app')->plainTextToken;

    return response()->json([
        'message' => 'Login successful!',
        'user' => $user,
        'token' => $token
    ], 200);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}