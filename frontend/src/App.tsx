import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { UserProfile } from './components/UserProfile';

const AppContent: React.FC = () => {
  const { isLoading, error, isAuthenticated, login } = useAuth();

  // Показываем загрузку во время инициализации
  if (isLoading) {
    return <LoadingSpinner message="Инициализация приложения..." />;
  }

  // Показываем ошибку, если что-то пошло не так
  if (error) {
    return <ErrorMessage message={error} onRetry={login} />;
  }

  // Если пользователь авторизован, показываем профиль
  if (isAuthenticated) {
    return <UserProfile />;
  }

  // Показываем экран авторизации (обычно не должно происходить, 
  // так как авторизация происходит автоматически)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex flex-col items-center space-y-6 max-w-md">
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
        
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Добро пожаловать!
        </h2>
        
        <p className="text-gray-600 text-center">
          Нажмите кнопку ниже для авторизации через Telegram
        </p>
        
        <button
          onClick={login}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Войти через Telegram
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
