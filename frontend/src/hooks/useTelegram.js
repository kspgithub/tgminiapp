import { useEffect, useState } from 'react'

const tg = window.Telegram?.WebApp

export function useTelegram() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (tg) {
      // Инициализация приложения
      tg.expand()
      
      // Настройка главной кнопки
      tg.MainButton.setText('Отправить данные')
      tg.MainButton.color = '#2481cc'
      
      // Скрытие кнопки "Назад" по умолчанию
      tg.BackButton.hide()
      
      // Получение данных пользователя
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user)
      }
      
      setReady(true)
    }
  }, [])

  const onClose = () => {
    tg?.close()
  }

  const onToggleMainButton = () => {
    if (tg?.MainButton.isVisible) {
      tg.MainButton.hide()
    } else {
      tg.MainButton.show()
    }
  }

  const onSendData = (data) => {
    if (tg) {
      tg.sendData(JSON.stringify(data))
    }
  }

  const onMainButtonClick = (callback) => {
    if (tg) {
      tg.MainButton.onClick(callback)
    }
  }

  const onBackButtonClick = (callback) => {
    if (tg) {
      tg.BackButton.onClick(callback)
    }
  }

  const showBackButton = () => {
    if (tg) {
      tg.BackButton.show()
    }
  }

  const hideBackButton = () => {
    if (tg) {
      tg.BackButton.hide()
    }
  }

  const showAlert = (message) => {
    if (tg) {
      tg.showAlert(message)
    }
  }

  const showConfirm = (message, callback) => {
    if (tg) {
      tg.showConfirm(message, callback)
    }
  }

  const showPopup = (params) => {
    if (tg) {
      tg.showPopup(params)
    }
  }

  const hapticFeedback = (type = 'impact') => {
    if (tg?.HapticFeedback) {
      switch (type) {
        case 'light':
          tg.HapticFeedback.impactOccurred('light')
          break
        case 'medium':
          tg.HapticFeedback.impactOccurred('medium')
          break
        case 'heavy':
          tg.HapticFeedback.impactOccurred('heavy')
          break
        case 'error':
          tg.HapticFeedback.notificationOccurred('error')
          break
        case 'success':
          tg.HapticFeedback.notificationOccurred('success')
          break
        case 'warning':
          tg.HapticFeedback.notificationOccurred('warning')
          break
        case 'selection':
          tg.HapticFeedback.selectionChanged()
          break
        default:
          tg.HapticFeedback.impactOccurred('medium')
      }
    }
  }

  return {
    tg,
    user,
    ready,
    onClose,
    onToggleMainButton,
    onSendData,
    onMainButtonClick,
    onBackButtonClick,
    showBackButton,
    hideBackButton,
    showAlert,
    showConfirm,
    showPopup,
    hapticFeedback,
    queryId: tg?.initDataUnsafe?.query_id,
    initData: tg?.initData,
    initDataUnsafe: tg?.initDataUnsafe,
    colorScheme: tg?.colorScheme,
    themeParams: tg?.themeParams,
    isExpanded: tg?.isExpanded,
    viewportHeight: tg?.viewportHeight,
    viewportStableHeight: tg?.viewportStableHeight,
    headerColor: tg?.headerColor,
    backgroundColor: tg?.backgroundColor,
    isClosingConfirmationEnabled: tg?.isClosingConfirmationEnabled,
    isVerticalSwipesEnabled: tg?.isVerticalSwipesEnabled
  }
}