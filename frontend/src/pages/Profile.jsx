import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { api } from '../utils/api'

const Profile = () => {
  const { 
    user, 
    tg, 
    showBackButton, 
    hideBackButton, 
    onBackButtonClick,
    colorScheme,
    themeParams,
    viewportHeight,
    hapticFeedback
  } = useTelegram()
  
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Показать кнопку "Назад"
    showBackButton()
    
    // Обработчик кнопки "Назад"
    onBackButtonClick(() => {
      window.history.back()
    })

    // Скрыть главную кнопку
    if (tg?.MainButton) {
      tg.MainButton.hide()
    }

    return () => {
      hideBackButton()
    }
  }, [])

  const validateUser = async () => {
    if (!tg?.initData) {
      return
    }

    setLoading(true)
    hapticFeedback('light')

    try {
      const response = await api.post('/api/telegram/validate-user', {
        initData: tg.initData
      })
      
      setUserInfo(response.data)
      hapticFeedback('success')
    } catch (error) {
      console.error('Ошибка валидации:', error)
      hapticFeedback('error')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString('ru-RU')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="fade-in">
        <h1 className="text-2xl font-bold text-center mb-8 text-tg-text">
          👤 Профиль
        </h1>

        {user && (
          <div className="telegram-card mb-6">
            <div className="text-center mb-4">
              {user.photo_url && (
                <img 
                  src={user.photo_url} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-full mx-auto mb-3"
                />
              )}
              <h2 className="text-xl font-semibold text-tg-text">
                {user.first_name} {user.last_name}
              </h2>
              {user.username && (
                <p className="text-tg-hint">@{user.username}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-tg-hint">ID:</span>
                <span className="text-tg-text font-mono">{user.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-tg-hint">Язык:</span>
                <span className="text-tg-text">{user.language_code || 'не указан'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-tg-hint">Premium:</span>
                <span className="text-tg-text">
                  {user.is_premium ? '✅ Да' : '❌ Нет'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-tg-hint">Разрешает писать:</span>
                <span className="text-tg-text">
                  {user.allows_write_to_pm ? '✅ Да' : '❌ Нет'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="telegram-card mb-6">
          <h3 className="font-semibold text-tg-text mb-3">Информация о приложении</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-tg-hint">Тема:</span>
              <span className="text-tg-text">{colorScheme || 'не определена'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-tg-hint">Высота экрана:</span>
              <span className="text-tg-text">{viewportHeight || 'не определена'}px</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-tg-hint">Платформа:</span>
              <span className="text-tg-text">{tg?.platform || 'не определена'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={validateUser}
            disabled={loading}
            className="w-full telegram-button disabled:opacity-50"
          >
            {loading ? 'Проверка...' : 'Проверить пользователя'}
          </button>

          {userInfo && (
            <div className="telegram-card">
              <h4 className="font-semibold text-tg-text mb-2">Результат валидации:</h4>
              <pre className="text-xs text-tg-text bg-tg-bg p-2 rounded overflow-x-auto">
                {JSON.stringify(userInfo, null, 2)}
              </pre>
            </div>
          )}

          <Link
            to="/"
            className="block w-full bg-tg-secondary-bg text-tg-text px-4 py-2 rounded-lg font-medium text-center hover:opacity-80 transition-all duration-200"
          >
            ← Назад на главную
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Profile