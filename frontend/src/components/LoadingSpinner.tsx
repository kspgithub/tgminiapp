import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Загрузка...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex flex-col items-center space-y-4">
        {/* Спиннер */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        </div>
        
        {/* Сообщение */}
        <p className="text-gray-600 text-center max-w-sm">
          {message}
        </p>
      </div>
    </div>
  );
}; 