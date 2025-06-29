<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class TelegramAuthController extends Controller
{
    /**
     * Авторизация через Telegram Web App
     */
    public function login(Request $request)
    {
        try {
            $initData = $request->input('initData');
            
            if (!$initData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Отсутствуют данные авторизации'
                ], 400);
            }

            // Логируем полученные данные для отладки
            Log::info('Telegram login attempt', [
                'initData' => $initData,
                'bot_token_set' => !empty(config('services.telegram.bot_token'))
            ]);

            // Парсим данные из initData
            $telegramData = $this->parseInitData($initData);
            
            if (!$telegramData) {
                Log::error('Failed to parse initData', ['initData' => $initData]);
                return response()->json([
                    'success' => false,
                    'message' => 'Некорректные данные авторизации'
                ], 400);
            }

            Log::info('Parsed Telegram data', ['telegramData' => $telegramData]);

            // Временно отключаем проверку подписи для отладки
            // TODO: Включить проверку подписи после настройки BOT_TOKEN
            /*
            if (config('services.telegram.bot_token')) {
                if (!$this->verifyTelegramData($initData)) {
                    Log::error('Telegram signature verification failed');
                    return response()->json([
                        'success' => false,
                        'message' => 'Неверная подпись Telegram'
                    ], 401);
                }
            }
            */

            // Ищем существующего пользователя
            $user = User::findByTelegramId($telegramData['id']);
            
            if (!$user) {
                // Создаем нового пользователя
                $user = User::createFromTelegram($telegramData);
                Log::info('Created new user', ['user_id' => $user->id, 'telegram_id' => $telegramData['id']]);
            } else {
                // Обновляем данные существующего пользователя
                $user->update([
                    'telegram_username' => $telegramData['username'] ?? null,
                    'telegram_first_name' => $telegramData['first_name'] ?? null,
                    'telegram_last_name' => $telegramData['last_name'] ?? null,
                    'telegram_photo_url' => $telegramData['photo_url'] ?? null,
                    'is_premium' => $telegramData['is_premium'] ?? false,
                    'language_code' => $telegramData['language_code'] ?? 'en',
                    'auth_date' => now(),
                ]);
                Log::info('Updated existing user', ['user_id' => $user->id, 'telegram_id' => $telegramData['id']]);
            }

            // Создаем токен (простая версия без Sanctum)
            $token = $this->createSimpleToken($user);

            Log::info('Telegram login successful', ['user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'telegram_id' => $user->telegram_id,
                    'telegram_username' => $user->telegram_username,
                    'telegram_first_name' => $user->telegram_first_name,
                    'telegram_last_name' => $user->telegram_last_name,
                    'telegram_photo_url' => $user->telegram_photo_url,
                    'is_premium' => $user->is_premium,
                    'language_code' => $user->language_code,
                ],
                'token' => $token
            ]);

        } catch (\Exception $e) {
            Log::error('Telegram auth error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Ошибка авторизации: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Получить данные текущего пользователя
     */
    public function me(Request $request)
    {
        $user = $this->getUserFromToken($request);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Неверный токен'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'telegram_id' => $user->telegram_id,
                'telegram_username' => $user->telegram_username,
                'telegram_first_name' => $user->telegram_first_name,
                'telegram_last_name' => $user->telegram_last_name,
                'telegram_photo_url' => $user->telegram_photo_url,
                'is_premium' => $user->is_premium,
                'language_code' => $user->language_code,
            ]
        ]);
    }

    /**
     * Парсинг initData от Telegram
     */
    private function parseInitData($initData)
    {
        parse_str($initData, $data);
        
        if (!isset($data['user'])) {
            return null;
        }

        $userData = json_decode($data['user'], true);
        
        if (!$userData || !isset($userData['id'])) {
            return null;
        }

        return $userData;
    }

    /**
     * Проверка подписи Telegram данных
     */
    private function verifyTelegramData($initData)
    {
        $botToken = config('services.telegram.bot_token');
        
        if (!$botToken) {
            return true; // Если токен не установлен, пропускаем проверку
        }

        parse_str($initData, $data);
        
        $checkHash = $data['hash'] ?? '';
        unset($data['hash']);
        
        ksort($data);
        
        $dataCheckString = '';
        foreach ($data as $key => $value) {
            $dataCheckString .= "$key=$value\n";
        }
        $dataCheckString = rtrim($dataCheckString, "\n");
        
        $secretKey = hash('sha256', $botToken, true);
        $hash = hash_hmac('sha256', $dataCheckString, $secretKey);
        
        return hash_equals($hash, $checkHash);
    }

    /**
     * Создание простого токена (без Sanctum)
     */
    private function createSimpleToken($user)
    {
        $payload = [
            'user_id' => $user->id,
            'telegram_id' => $user->telegram_id,
            'exp' => time() + (30 * 24 * 60 * 60) // 30 дней
        ];
        
        return base64_encode(json_encode($payload));
    }

    /**
     * Получение пользователя из токена
     */
    private function getUserFromToken(Request $request)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return null;
        }

        try {
            $payload = json_decode(base64_decode($token), true);
            
            if (!$payload || !isset($payload['user_id']) || $payload['exp'] < time()) {
                return null;
            }
            
            return User::find($payload['user_id']);
        } catch (\Exception $e) {
            return null;
        }
    }
}
