import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, User, ApiResponse } from '../types/telegram';

// Конфигурация API
const API_BASE_URL = 'https://api.kspgame.ru/api';

class ApiService {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Загружаем токен из localStorage
    this.token = localStorage.getItem('auth_token');
    if (this.token) {
      this.setAuthToken(this.token);
    }

    // Интерцептор для автоматического добавления токена
    this.client.interceptors.request.use((config) => {
      if (this.token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Интерцептор для обработки ошибок
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Устанавливает токен авторизации
   */
  setAuthToken(token: string): void {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Очищает данные авторизации
   */
  clearAuth(): void {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
  }

  /**
   * Проверяет, авторизован ли пользователь
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Авторизация через Telegram
   */
  async loginWithTelegram(initData: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/telegram/login', {
        initData,
      });

      if (response.data.success && response.data.token) {
        this.setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка авторизации',
      };
    }
  }

  /**
   * Получение данных текущего пользователя
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<{ success: boolean; user: User }> = await this.client.get('/auth/me');
      
      return {
        success: response.data.success,
        data: response.data.user,
      };
    } catch (error: any) {
      console.error('Get user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка получения данных пользователя',
      };
    }
  }

  /**
   * Проверка работоспособности API
   */
  async healthCheck(): Promise<ApiResponse> {
    try {
      const response = await this.client.get('/test');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Health check error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'API недоступен',
      };
    }
  }

  /**
   * Выход из системы
   */
  logout(): void {
    this.clearAuth();
  }
}

// Экспортируем единственный экземпляр сервиса
export const apiService = new ApiService(); 