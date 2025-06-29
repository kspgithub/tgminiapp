import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <div className="flex flex-col items-center space-y-6 max-w-md">
        {/* Иконка ошибки */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        
        {/* Заголовок */}
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Ошибка авторизации
        </h2>
        
        {/* Сообщение об ошибке */}
        <p className="text-gray-600 text-center">
          {message}
        </p>
        
        {/* Кнопка повтора */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Попробовать снова
          </button>
        )}
        
        {/* Инструкция */}
        <div className="text-sm text-gray-500 text-center space-y-2">
          <p>Убедитесь, что:</p>
          <ul className="list-disc list-inside space-y-1 text-left">
            <li>Приложение открыто в Telegram</li>
            <li>У вас есть интернет-соединение</li>
            <li>Бот настроен правильно</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 