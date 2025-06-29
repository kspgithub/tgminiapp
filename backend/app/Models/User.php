<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'telegram_id',
        'telegram_username',
        'telegram_first_name',
        'telegram_last_name',
        'telegram_photo_url',
        'is_premium',
        'language_code',
        'auth_date',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'auth_date' => 'datetime',
            'is_premium' => 'boolean',
        ];
    }

    /**
     * Найти пользователя по Telegram ID
     */
    public static function findByTelegramId($telegramId)
    {
        return static::where('telegram_id', $telegramId)->first();
    }

    /**
     * Создать пользователя из данных Telegram
     */
    public static function createFromTelegram(array $telegramData)
    {
        return static::create([
            'name' => trim(($telegramData['first_name'] ?? '') . ' ' . ($telegramData['last_name'] ?? '')),
            'telegram_id' => $telegramData['id'],
            'telegram_username' => $telegramData['username'] ?? null,
            'telegram_first_name' => $telegramData['first_name'] ?? null,
            'telegram_last_name' => $telegramData['last_name'] ?? null,
            'telegram_photo_url' => $telegramData['photo_url'] ?? null,
            'is_premium' => $telegramData['is_premium'] ?? false,
            'language_code' => $telegramData['language_code'] ?? 'en',
            'auth_date' => now(),
        ]);
    }

    /**
     * Проверить, является ли пользователь пользователем Telegram
     */
    public function isTelegramUser(): bool
    {
        return !is_null($this->telegram_id);
    }
}
