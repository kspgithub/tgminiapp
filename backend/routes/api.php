<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TelegramAuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Применяем CORS middleware ко всем API роутам
Route::middleware(['telegram.cors'])->group(function () {
    // Публичные роуты авторизации
    Route::prefix('auth')->group(function () {
        Route::post('telegram/login', [TelegramAuthController::class, 'login']);
    });

    // Защищенные роуты (требуют авторизацию)
    Route::middleware('telegram.auth')->group(function () {
        Route::prefix('auth')->group(function () {
            Route::get('me', [TelegramAuthController::class, 'me']);
        });
    });

    // Тестовый роут
    Route::get('test', function () {
        return response()->json([
            'message' => 'API работает!',
            'timestamp' => now()->toISOString()
        ]);
    });
}); 