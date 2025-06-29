import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, TelegramWebApp } from '../types/telegram';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  webApp: TelegramWebApp | null;
  login: () => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  // Инициализация Telegram WebApp
  useEffect(() => {
    const initTelegram = () => {
      if (window.Telegram?.WebApp) {
        const tgWebApp = window.Telegram.WebApp;
        setWebApp(tgWebApp);
        
        // Расширяем приложение до полного экрана
        tgWebApp.expand();
        
        // Сообщаем Telegram, что приложение готово
        tgWebApp.ready();
        
        console.log('Telegram WebApp initialized:', {
          version: tgWebApp.version,
          platform: tgWebApp.platform,
          initData: tgWebApp.initData,
        });
      } else {
        console.warn('Telegram WebApp not available');
      }
    };

    // Проверяем наличие Telegram WebApp
    if (window.Telegram?.WebApp) {
      initTelegram();
    } else {
      // Ждем загрузки скрипта Telegram
      const checkTelegram = setInterval(() => {
        if (window.Telegram?.WebApp) {
          initTelegram();
          clearInterval(checkTelegram);
        }
      }, 100);

      // Таймаут на случай, если скрипт не загрузится
      setTimeout(() => {
        clearInterval(checkTelegram);
        if (!window.Telegram?.WebApp) {
          console.error('Telegram WebApp script not loaded');
          setError('Приложение должно быть открыто в Telegram');
          setIsLoading(false);
        }
      }, 5000);
    }
  }, []);

  // Автоматическая авторизация при инициализации
  useEffect(() => {
    const autoLogin = async () => {
      if (!webApp) return;

      setIsLoading(true);
      setError(null);

      try {
        // Проверяем, есть ли сохраненный токен
        if (apiService.isAuthenticated()) {
          const response = await apiService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
            setIsLoading(false);
            return;
          } else {
            // Токен недействителен, очищаем
            apiService.clearAuth();
          }
        }

        // Пытаемся авторизоваться через Telegram
        await login();
      } catch (error) {
        console.error('Auto login failed:', error);
        setError('Ошибка автоматической авторизации');
      } finally {
        setIsLoading(false);
      }
    };

    if (webApp) {
      autoLogin();
    }
  }, [webApp]);

  const login = async (): Promise<boolean> => {
    if (!webApp?.initData) {
      setError('Нет данных от Telegram');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.loginWithTelegram(webApp.initData);
      
      if (response.success && response.user) {
        setUser(response.user);
        
        // Показываем уведомление об успешной авторизации
        if (webApp.HapticFeedback) {
          webApp.HapticFeedback.notificationOccurred('success');
        }
        
        return true;
      } else {
        setError(response.message || 'Ошибка авторизации');
        
        if (webApp.HapticFeedback) {
          webApp.HapticFeedback.notificationOccurred('error');
        }
        
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Ошибка сети');
      
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred('error');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setError(null);
    
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred('light');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    webApp,
    login,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 