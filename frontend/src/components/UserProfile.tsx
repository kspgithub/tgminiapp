import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, logout, webApp } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Telegram Mini App
          </h1>
          <p className="text-gray-600">
            Добро пожаловать!
          </p>
        </div>

        {/* Карточка профиля */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            {/* Аватар */}
            <div className="flex-shrink-0">
              {user.telegram_photo_url ? (
                <img
                  src={user.telegram_photo_url}
                  alt="Аватар"
                  className="w-16 h-16 rounded-full border-2 border-blue-200"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-blue-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Информация о пользователе */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              {user.telegram_username && (
                <p className="text-gray-600">
                  @{user.telegram_username}
                </p>
              )}
              {user.is_premium && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                  ⭐ Premium
                </span>
              )}
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Telegram ID:</span>
              <span className="font-mono text-sm text-gray-800">
                {user.telegram_id}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Язык:</span>
              <span className="text-gray-800">
                {user.language_code?.toUpperCase() || 'EN'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ID в системе:</span>
              <span className="text-gray-800">
                #{user.id}
              </span>
            </div>
          </div>
        </div>

        {/* Информация о WebApp */}
        {webApp && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Информация о приложении
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Версия:</span>
                <span className="text-gray-800">{webApp.version}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Платформа:</span>
                <span className="text-gray-800">{webApp.platform}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Тема:</span>
                <span className="text-gray-800">
                  {webApp.colorScheme === 'dark' ? '🌙 Темная' : '☀️ Светлая'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Развернуто:</span>
                <span className="text-gray-800">
                  {webApp.isExpanded ? '✅ Да' : '❌ Нет'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Выйти
          </button>
          
          {webApp && (
            <button
              onClick={() => webApp.close()}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Закрыть приложение
            </button>
          )}
        </div>

        {/* Нижний текст */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Спасибо за использование нашего приложения!</p>
        </div>
      </div>
    </div>
  );
}; 