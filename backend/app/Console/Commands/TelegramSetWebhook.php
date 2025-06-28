<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TelegramService;

class TelegramSetWebhook extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegram:set-webhook {--remove : Remove webhook instead of setting it}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set or remove Telegram webhook for the bot';

    protected TelegramService $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        parent::__construct();
        $this->telegramService = $telegramService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('remove')) {
            $this->removeWebhook();
        } else {
            $this->setWebhook();
        }
    }

    private function setWebhook()
    {
        $this->info('Setting Telegram webhook...');
        
        $webhookUrl = config('telegram.webhook_url');
        $this->info("Webhook URL: {$webhookUrl}");
        
        $response = $this->telegramService->setWebhook();
        
        if ($response['ok']) {
            $this->info('✅ Webhook successfully set!');
            $this->info('Description: ' . $response['description']);
        } else {
            $this->error('❌ Failed to set webhook');
            $this->error('Error: ' . ($response['description'] ?? 'Unknown error'));
        }
    }

    private function removeWebhook()
    {
        $this->info('Removing Telegram webhook...');
        
        $response = $this->telegramService->removeWebhook();
        
        if ($response['ok']) {
            $this->info('✅ Webhook successfully removed!');
        } else {
            $this->error('❌ Failed to remove webhook');
            $this->error('Error: ' . ($response['description'] ?? 'Unknown error'));
        }
    }
}