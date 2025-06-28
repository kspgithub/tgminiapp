# 🚀 Telegram Mini App - Laravel + React

Полнофункциональное мини-приложение для Telegram, построенное на Laravel (backend) и React (frontend) с развертыванием в Docker.

## 📋 Возможности

- ✅ **Laravel 10** - современный PHP фреймворк для API
- ⚛️ **React 18** - интерактивный пользовательский интерфейс
- 🐳 **Docker** - контейнеризация для легкого развертывания
- 🤖 **Telegram Bot API** - полная интеграция с Telegram
- 🎨 **Tailwind CSS** - адаптивный дизайн с поддержкой тем Telegram
- 🔐 **Валидация данных** - безопасная проверка пользователей Telegram
- 📱 **PWA Ready** - поддержка прогрессивных веб-приложений
- 🌓 **Темная/светлая тема** - автоматическое переключение по настройкам Telegram

## 🏗️ Архитектура проекта

```
tgminiapp/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Services/
│   │   └── Console/Commands/
│   ├── config/
│   ├── routes/
│   └── ...
├── frontend/               # React приложение
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── ...
├── docker/                # Docker конфигурация
│   ├── nginx/
│   ├── php/
│   └── node/
├── docker-compose.yml     # Основная конфигурация Docker
├── deploy.sh             # Скрипт развертывания
└── README.md
```

## 🚀 Быстрый старт

### Предварительные требования

- Docker и Docker Compose
- Telegram бот (создать через [@BotFather](https://t.me/BotFather))
- Домен или ngrok для webhook (в продакшене)

### 1. Клонирование и настройка

```bash
# Клонирование проекта
git clone <your-repo-url> tgminiapp
cd tgminiapp

# Запуск автоматического развертывания
chmod +x deploy.sh
./deploy.sh
```

### 2. Настройка Telegram бота

1. **Создайте бота через [@BotFather](https://t.me/BotFather):**
   ```
   /newbot
   Имя бота: Ваше Mini App
   Username: your_miniapp_bot
   ```

2. **Получите токен бота и добавьте в `backend/.env`:**
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_BOT_USERNAME=your_miniapp_bot
   APP_URL=https://your-domain.com
   ```

3. **Создайте мини-приложение:**
   ```
   /newapp
   @your_miniapp_bot
   Имя приложения: Mini App
   Описание: Описание вашего приложения
   Фото: (загрузите иконку 640x360)
   GIF: (опционально)
   URL: https://your-domain.com
   ```

### 3. Установка webhook

```bash
# Установка webhook
docker-compose exec app php artisan telegram:set-webhook

# Проверка webhook
docker-compose exec app php artisan telegram:webhook-info
```

## 🛠️ Разработка

### Локальная разработка

```bash
# Запуск в режиме разработки
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Вход в контейнер приложения
docker-compose exec app bash

# Вход в контейнер фронтенда
docker-compose exec frontend sh
```

### Работа с Laravel

```bash
# Artisan команды
docker-compose exec app php artisan migrate
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:cache

# Установка пакетов
docker-compose exec app composer install
docker-compose exec app composer require package-name
```

### Работа с React

```bash
# Установка пакетов
docker-compose exec frontend npm install

# Сборка для продакшена
docker-compose exec frontend npm run build

# Режим разработки
docker-compose exec frontend npm run dev
```

## 📦 Развертывание в продакшене

### 1. Подготовка сервера

```bash
# На сервере
git clone <your-repo-url> /var/www/tgminiapp
cd /var/www/tgminiapp

# Настройка переменных окружения
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Редактирование конфигурации
nano backend/.env
nano frontend/.env
```

### 2. Настройка продакшена

```bash
# backend/.env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
TELEGRAM_BOT_TOKEN=your_real_bot_token

# frontend/.env
VITE_API_BASE_URL=https://your-domain.com/api
```

### 3. Развертывание

```bash
# Запуск в продакшене
./deploy.sh --production

# Настройка SSL (если нужно)
# Добавьте сертификаты в docker/nginx/ssl/

# Установка webhook
docker-compose exec app php artisan telegram:set-webhook
```

## 🔧 Конфигурация

### Nginx конфигурация

Файл `docker/nginx/conf.d/app.conf` содержит настройки для:
- Обработки API запросов Laravel
- Статических файлов React
- Кэширования ресурсов
- Безопасности

### PHP конфигурация

Файл `docker/php/local.ini`:
```ini
upload_max_filesize=40M
post_max_size=40M
memory_limit=512M
max_execution_time=600
```

### База данных

По умолчанию используется PostgreSQL:
```env
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=tg_miniapp
DB_USERNAME=laravel
DB_PASSWORD=laravel_password
```

## 🔐 Безопасность

### Валидация Telegram данных

Приложение автоматически валидирует данные от Telegram:

```php
// В Laravel
$isValid = $telegramService->validateInitData($initData);

// В React
const { initData } = useTelegram();
```

### CORS настройки

Настройте CORS в `backend/config/cors.php` для продакшена.

## 📱 API Endpoints

### Основные эндпоинты

- `GET /api/health` - проверка работоспособности
- `POST /api/telegram/webhook` - webhook для Telegram
- `POST /api/telegram/validate-user` - валидация пользователя
- `POST /api/telegram/user-info` - информация о пользователе

### Пример использования

```javascript
// Валидация пользователя
const response = await api.post('/api/telegram/validate-user', {
  initData: window.Telegram.WebApp.initData
});

if (response.data.valid) {
  console.log('Пользователь валиден:', response.data.user);
}
```

## 🎨 Кастомизация

### Темы Telegram

CSS переменные автоматически обновляются:

```css
:root {
  --tg-color-bg: #ffffff;
  --tg-color-text: #000000;
  --tg-color-button: #2481cc;
}

[data-theme="dark"] {
  --tg-color-bg: #212121;
  --tg-color-text: #ffffff;
  --tg-color-button: #8774e1;
}
```

### Компоненты

Используйте готовые классы:

```jsx
<button className="telegram-button">
  Кнопка в стиле Telegram
</button>

<div className="telegram-card">
  Карточка в стиле Telegram
</div>
```

## 🐛 Отладка

### Логи

```bash
# Все логи
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f app
docker-compose logs -f webserver
docker-compose logs -f frontend

# Laravel логи
docker-compose exec app tail -f storage/logs/laravel.log
```

### Проблемы и решения

1. **Webhook не работает:**
   ```bash
   # Проверьте статус webhook
   docker-compose exec app php artisan telegram:webhook-info
   
   # Переустановите webhook
   docker-compose exec app php artisan telegram:set-webhook
   ```

2. **Ошибки CORS:**
   ```bash
   # Очистите кэш конфигурации
   docker-compose exec app php artisan config:cache
   ```

3. **Проблемы с правами:**
   ```bash
   # Исправьте права доступа
   docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
   ```

## 📚 Полезные ссылки

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Docker Documentation](https://docs.docker.com)

## 🤝 Вклад в проект

1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 👨‍💻 Автор

Создано для демонстрации возможностей Telegram Mini Apps с современным стеком технологий.

---

**Нужна помощь?** Создайте issue в репозитории или свяжитесь с автором.