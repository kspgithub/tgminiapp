FROM node:18-alpine

WORKDIR /app

# Копирование package.json и package-lock.json
COPY frontend/package*.json ./

# Установка зависимостей
RUN npm ci --only=production

# Копирование исходного кода
COPY frontend/ .

# Сборка приложения
RUN npm run build

# Экспонирование порта
EXPOSE 3000

# Команда по умолчанию
CMD ["npm", "start"]