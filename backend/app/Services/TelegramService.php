<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class TelegramService
{
    protected string $botToken;
    protected string $apiUrl;

    public function __construct()
    {
        $this->botToken = config('telegram.bot_token');
        $this->apiUrl = "https://api.telegram.org/bot{$this->botToken}";
    }

    /**
     * Обработка обновления от Telegram
     */
    public function processUpdate(array $update): void
    {
        if (isset($update['message'])) {
            $this->processMessage($update['message']);
        }

        if (isset($update['callback_query'])) {
            $this->processCallbackQuery($update['callback_query']);
        }

        if (isset($update['web_app_data'])) {
            $this->processWebAppData($update['web_app_data']);
        }
    }

    /**
     * Обработка текстового сообщения
     */
    protected function processMessage(array $message): void
    {
        $chatId = $message['chat']['id'];
        $text = $message['text'] ?? '';

        if ($text === '/start') {
            $this->sendWelcomeMessage($chatId);
        }
    }

    /**
     * Отправка приветственного сообщения с кнопкой Mini App
     */
    protected function sendWelcomeMessage(int $chatId): void
    {
        $keyboard = [
            'inline_keyboard' => [
                [
                    [
                        'text' => '🚀 Открыть приложение',
                        'web_app' => [
                            'url' => config('telegram.mini_app_url')
                        ]
                    ]
                ]
            ]
        ];

        $this->sendMessage($chatId, '👋 Добро пожаловать! Нажмите кнопку ниже, чтобы открыть мини-приложение.', $keyboard);
    }

    /**
     * Отправка сообщения
     */
    public function sendMessage(int $chatId, string $text, array $keyboard = null): array
    {
        $data = [
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => 'HTML'
        ];

        if ($keyboard) {
            $data['reply_markup'] = json_encode($keyboard);
        }

        $response = Http::post($this->apiUrl . '/sendMessage', $data);

        return $response->json();
    }

    /**
     * Валидация init data от Telegram
     */
    public function validateInitData(string $initData): bool
    {
        $data = [];
        parse_str($initData, $data);

        if (!isset($data['hash'])) {
            return false;
        }

        $hash = $data['hash'];
        unset($data['hash']);

        $dataCheckString = [];
        foreach ($data as $key => $value) {
            $dataCheckString[] = $key . '=' . $value;
        }
        sort($dataCheckString);
        $dataCheckString = implode("\n", $dataCheckString);

        $secretKey = hash('sha256', $this->botToken, true);
        $calculatedHash = hash_hmac('sha256', $dataCheckString, $secretKey);

        return hash_equals($calculatedHash, $hash);
    }

    /**
     * Парсинг данных пользователя из init data
     */
    public function parseUserFromInitData(string $initData): array
    {
        $data = [];
        parse_str($initData, $data);

        if (isset($data['user'])) {
            return json_decode($data['user'], true);
        }

        return [];
    }

    /**
     * Обработка callback query
     */
    protected function processCallbackQuery(array $callbackQuery): void
    {
        $callbackId = $callbackQuery['id'];
        
        // Ответ на callback query
        Http::post($this->apiUrl . '/answerCallbackQuery', [
            'callback_query_id' => $callbackId
        ]);
    }

    /**
     * Обработка данных Web App
     */
    protected function processWebAppData(array $webAppData): void
    {
        Log::info('Web App Data received', $webAppData);
        // Здесь можно обработать данные, полученные от мини-приложения
    }

    /**
     * Установка webhook
     */
    public function setWebhook(): array
    {
        $response = Http::post($this->apiUrl . '/setWebhook', [
            'url' => config('telegram.webhook_url'),
            'allowed_updates' => config('telegram.allowed_updates')
        ]);

        return $response->json();
    }

    /**
     * Удаление webhook
     */
    public function removeWebhook(): array
    {
        $response = Http::post($this->apiUrl . '/deleteWebhook');

        return $response->json();
    }

    /**
     * Получение информации о webhook
     */
    public function getWebhookInfo(): array
    {
        $response = Http::get($this->apiUrl . '/getWebhookInfo');

        return $response->json();
    }

    /**
     * Получение информации о боте
     */
    public function getBotInfo(): array
    {
        $response = Http::get($this->apiUrl . '/getMe');

        return $response->json();
    }
}