<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Service_CenterController;
use App\Http\Controllers\MitraController;

Route::apiResource('users', UserController::class);
Route::apiResource('service_centers', Service_CenterController::class);
Route::apiResource('mitras', MitraController::class);
