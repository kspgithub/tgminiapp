<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TelegramController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Telegram routes
Route::prefix('telegram')->group(function () {
    Route::post('/webhook', [TelegramController::class, 'webhook']);
    Route::post('/validate-user', [TelegramController::class, 'validateUser']);
    Route::post('/user-info', [TelegramController::class, 'getUserInfo']);
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'service' => 'Telegram Mini App API'
    ]);
});