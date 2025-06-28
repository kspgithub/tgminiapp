<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class TelegramController extends Controller
{
    protected TelegramService $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Обработка webhook от Telegram
     */
    public function webhook(Request $request): JsonResponse
    {
        try {
            $update = $request->all();
            Log::info('Telegram webhook received', $update);

            $this->telegramService->processUpdate($update);

            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            Log::error('Telegram webhook error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Проверка данных пользователя из Telegram Mini App
     */
    public function validateUser(Request $request): JsonResponse
    {
        try {
            $initData = $request->input('initData');
            
            if (!$initData) {
                return response()->json(['error' => 'Init data required'], 400);
            }

            $isValid = $this->telegramService->validateInitData($initData);
            
            if (!$isValid) {
                return response()->json(['error' => 'Invalid init data'], 401);
            }

            $user = $this->telegramService->parseUserFromInitData($initData);
            
            return response()->json([
                'valid' => true,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            Log::error('User validation error: ' . $e->getMessage());
            return response()->json(['error' => 'Validation failed'], 500);
        }
    }

    /**
     * Получение информации о пользователе
     */
    public function getUserInfo(Request $request): JsonResponse
    {
        try {
            $initData = $request->input('initData');
            $user = $this->telegramService->parseUserFromInitData($initData);
            
            return response()->json($user);
        } catch (\Exception $e) {
            Log::error('Get user info error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to get user info'], 500);
        }
    }
}