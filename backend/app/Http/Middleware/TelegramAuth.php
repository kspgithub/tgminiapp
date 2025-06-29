<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TelegramAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Отсутствует токен авторизации'
            ], 401);
        }

        try {
            $payload = json_decode(base64_decode($token), true);
            
            if (!$payload || !isset($payload['user_id']) || $payload['exp'] < time()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Неверный или истекший токен'
                ], 401);
            }
            
            $user = User::find($payload['user_id']);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Пользователь не найден'
                ], 401);
            }
            
            // Добавляем пользователя в запрос
            $request->merge(['auth_user' => $user]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка проверки токена'
            ], 401);
        }

        return $next($request);
    }
}
