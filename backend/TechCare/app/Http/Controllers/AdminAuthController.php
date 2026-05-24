<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    // 1. Show the HTML Login Form
    public function showLoginForm()
    {
        return view('login');
    }

    // 2. Process the Login Form Submission
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Attempt to log in using the 'admin' guard
        if (Auth::guard('admin')->attempt($credentials)) {
            // Success! Generate a new session to protect against session fixation
            $request->session()->regenerate();
            
            // Redirect to the dashboard
            return redirect()->intended('/admin/dashboard');
        }

        // Failed! Send them back with an error
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    // 3. Log Out
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();

        // Invalidate the session and clear the cookie
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/admin/login');
    }
}