import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Интерсептор для добавления Telegram данных в запросы
api.interceptors.request.use((config) => {
  const tg = window.Telegram?.WebApp
  
  if (tg?.initData) {
    config.headers['X-Telegram-Init-Data'] = tg.initData
  }
  
  return config
})

// Интерсептор для обработки ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    
    // Можно добавить обработку ошибок здесь
    if (error.response?.status === 401) {
      // Пользователь не авторизован
      console.warn('Unauthorized access')
    }
    
    return Promise.reject(error)
  }
)

export default api