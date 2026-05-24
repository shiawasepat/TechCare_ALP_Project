<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController; // Make sure to import this!

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {
    
    // PUBLIC ROUTES (Guests only)
    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
        Route::post('/login', [AdminAuthController::class, 'login']);
    });

    // PROTECTED ROUTES (Must be logged in as Admin)
    Route::middleware('auth:admin')->group(function () {
        
        // 0. The Dashboard (Hub)
        Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');

        // 1 & 2. Create Mitra + Service Center routes
        Route::get('/mitra/create', [AdminController::class, 'create'])->name('admin.mitra.create');
        Route::post('/mitra', [AdminController::class, 'store']);

        // 3. Add Technician to a specific Shop
        Route::post('/service_center/{id_service_center}/technician', [AdminController::class, 'storeTechnician']);

        // 3b. Delete a specific Technician from a Shop
        Route::delete('/service_center/{id_service_center}/technician/{id_technician}', [AdminController::class, 'destroyTechnician']);

        // 4. The "Nuke" Delete Route
        Route::delete('/service_center/{id_service_center}', [AdminController::class, 'destroy']);

        // Logout
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
    });

});