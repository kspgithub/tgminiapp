import React from 'react'

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-tg-bg">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-tg-button"></div>
        <p className="mt-4 text-tg-text text-lg">Загрузка...</p>
      </div>
    </div>
  )
}

export default Loading