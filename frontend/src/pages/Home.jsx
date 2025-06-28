import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { api } from '../utils/api'

const Home = () => {
  const { user, tg, onSendData, onMainButtonClick, hapticFeedback, showAlert } = useTelegram()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Настройка главной кнопки
    if (tg?.MainButton) {
      tg.MainButton.setText('Отправить сообщение')
      tg.MainButton.show()
      
      onMainButtonClick(() => {
        handleSendMessage()
      })
    }

    return () => {
      if (tg?.MainButton) {
        tg.MainButton.hide()
      }
    }
  }, [message])

  const handleSendMessage = async () => {
    if (!message.trim()) {
      showAlert('Пожалуйста, введите сообщение')
      return
    }

    setLoading(true)
    hapticFeedback('light')

    try {
      const data = {
        message: message.trim(),
        user: user,
        timestamp: new Date().toISOString()
      }

      // Отправка данных через Telegram
      onSendData(data)
      
      // Также можно отправить на сервер
      // await api.post('/api/messages', data)
      
      setMessage('')
      showAlert('Сообщение отправлено!')
      hapticFeedback('success')
    } catch (error) {
      console.error('Ошибка отправки:', error)
      showAlert('Ошибка при отправке сообщения')
      hapticFeedback('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="fade-in">
        <h1 className="text-3xl font-bold text-center mb-8 text-tg-text">
          🚀 Telegram Mini App
        </h1>

        {user && (
          <div className="telegram-card mb-6">
            <div className="flex items-center space-x-3">
              {user.photo_url && (
                <img 
                  src={user.photo_url} 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <h2 className="font-semibold text-tg-text">
                  Привет, {user.first_name}!
                </h2>
                <p className="text-sm text-tg-hint">
                  @{user.username || 'без username'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tg-text mb-2">
              Ваше сообщение:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите ваше сообщение..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tg-button bg-tg-bg text-tg-text"
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              className="flex-1 telegram-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Отправка...' : 'Отправить'}
            </button>
            
            <Link
              to="/profile"
              className="flex-1 bg-tg-secondary-bg text-tg-text px-4 py-2 rounded-lg font-medium text-center hover:opacity-80 transition-all duration-200"
            >
              Профиль
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-tg-hint text-sm">
            Это демонстрационное мини-приложение для Telegram
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home