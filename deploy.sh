#!/bin/bash

# Скрипт для развертывания Telegram Mini App
# Использование: ./deploy.sh [--production]

set -e

echo "🚀 Начинаем развертывание Telegram Mini App..."

# Проверка аргументов
PRODUCTION=false
if [ "$1" = "--production" ]; then
    PRODUCTION=true
    echo "📦 Режим продакшена"
else
    echo "🔧 Режим разработки"
fi

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
    exit 1
fi

# Функция для использования docker compose
docker_compose_cmd() {
    if command -v docker-compose &> /dev/null; then
        docker-compose "$@"
    else
        docker compose "$@"
    fi
}

# Остановка контейнеров, если они запущены
echo "🛑 Остановка существующих контейнеров..."
docker_compose_cmd down --remove-orphans || true

# Создание .env файлов, если они не существуют
echo "📝 Настройка конфигурации..."

if [ ! -f "backend/.env" ]; then
    echo "Создание backend/.env из backend/.env.example..."
    cp backend/.env.example backend/.env
    echo "⚠️  ВАЖНО: Не забудьте настроить TELEGRAM_BOT_TOKEN в backend/.env"
fi

if [ ! -f "frontend/.env" ]; then
    echo "Создание frontend/.env из frontend/.env.example..."
    cp frontend/.env.example frontend/.env
fi

# Сборка и запуск контейнеров
echo "🔨 Сборка Docker контейнеров..."
docker_compose_cmd build --no-cache

echo "🚢 Запуск контейнеров..."
docker_compose_cmd up -d

# Ожидание запуска контейнеров
echo "⏳ Ожидание запуска контейнеров..."
sleep 10

# Установка зависимостей Laravel
echo "📦 Установка зависимостей Laravel..."
docker_compose_cmd exec app composer install --no-dev --optimize-autoloader

# Генерация ключа приложения
echo "🔑 Генерация ключа приложения..."
docker_compose_cmd exec app php artisan key:generate --force

# Запуск миграций
echo "🗃️  Запуск миграций базы данных..."
docker_compose_cmd exec app php artisan migrate --force

# Очистка кэша
echo "🧹 Очистка кэша..."
docker_compose_cmd exec app php artisan config:cache
docker_compose_cmd exec app php artisan route:cache
docker_compose_cmd exec app php artisan view:cache

# Установка прав доступа
echo "🔐 Настройка прав доступа..."
docker_compose_cmd exec app chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Проверка статуса
echo "🔍 Проверка статуса сервисов..."
docker_compose_cmd ps

echo ""
echo "✅ Развертывание завершено!"
echo ""
echo "📋 Информация о сервисах:"
echo "   🌐 Веб-сервер: http://localhost"
echo "   🔧 API: http://localhost/api"
echo "   📊 Проверка здоровья: http://localhost/api/health"
echo "   🗄️  База данных: localhost:5432"
echo "   🔴 Redis: localhost:6379"
echo ""
echo "📝 Следующие шаги:"
echo "   1. Настройте TELEGRAM_BOT_TOKEN в backend/.env"
echo "   2. Обновите APP_URL в backend/.env на ваш домен"
echo "   3. Запустите: docker-compose exec app php artisan telegram:set-webhook"
echo "   4. Создайте мини-приложение в @BotFather"
echo ""
echo "🔧 Полезные команды:"
echo "   docker-compose logs -f          # Просмотр логов"
echo "   docker-compose exec app bash    # Вход в контейнер приложения"
echo "   docker-compose down             # Остановка всех сервисов"
echo ""