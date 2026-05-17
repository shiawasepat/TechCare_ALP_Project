<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Service_CenterController;
use App\Http\Controllers\MitraController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ChatsController;


//temporary untuk testing postman
Route::apiResource('service_centers', Service_CenterController::class);

Route::get('/service_centers', [Service_CenterController::class, 'index']);
Route::get('/service_centers/{service_center}', [Service_CenterController::class, 'show']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);
Route::get('/ratings', [RatingController::class, 'index']);

//register thingy magic
Route::post('/users', [UserController::class, 'store']);
Route::post('/mitras', [MitraController::class, 'store']);

//login
Route::post('/login', [AuthController::class, 'login']); 
Route::post('/mitra/login', [AuthController::class, 'loginMitra']);


// butuh token (protected routes)
Route::middleware('auth:sanctum')->group(function () {
    // for users
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/payments/mock', [PaymentController::class, 'simulatePayment']);

    //Chats
    Route::get('/orders/{order}/chat', [ChatsController::class, 'show']);
    Route::post('/orders/{order}/chat', [ChatsController::class, 'sendMessage']);


    // for mitras
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{service}', [ServiceController::class, 'update']); 
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);
    Route::get('/mitra/orders', [OrderController::class, 'getMitraOrders']); 
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);
    Route::post('/service_centers', [Service_CenterController::class, 'store']);
    Route::put('/service_centers/{service_center}', [Service_CenterController::class, 'update']);
    Route::delete('/service_centers/{service_center}', [Service_CenterController::class, 'destroy']);

});