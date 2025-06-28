import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTelegram } from './hooks/useTelegram'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Loading from './components/Loading'
import './App.css'

function App() {
  const { tg, user, ready } = useTelegram()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ready) {
      // Настройка темы в соответствии с Telegram
      if (tg.colorScheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }

      // Разрешение показа приложения
      tg.ready()
      setLoading(false)
    }
  }, [ready, tg])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App