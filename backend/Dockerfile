FROM php:8.2-fpm

# Устанавливаем системные зависимости и расширения PHP
RUN apt-get update && apt-get install -y \
 build-essential \
 libpng-dev \
 libjpeg62-turbo-dev \
 libfreetype6-dev \
 locales \
 zip \
 jpegoptim optipng pngquant gifsicle \
 vim \
 unzip \
 git \
 curl \
 libpq-dev \
 cron \
 libzip-dev \
 libgmp-dev \
 iputils-ping \
 nginx \
 supervisor

# Устанавливаем расширения PHP
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd
RUN docker-php-ext-install zip
# Установка расширения exif
RUN docker-php-ext-install exif

# Устанавливаем Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Копируем и устанавливаем зависимости приложения
COPY . /var/www/backend
WORKDIR /var/www/backend
RUN composer install --no-scripts

# Устанавливаем права на директорию storage
RUN chmod -R 777 /var/www/backend/storage

# Устанавливаем права на директорию cache для Laravel
RUN chmod -R 777 /var/www/backend/bootstrap/cache

# Конфигурируем nginx
RUN rm /etc/nginx/sites-enabled/default
COPY nginx.conf /etc/nginx/sites-available/backend
RUN ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/backend

# Конфигурируем supervisor
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Открываем порт для nginx
EXPOSE 80

# Запускаем supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

