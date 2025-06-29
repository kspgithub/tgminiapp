import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>KSP Game</h1>
      <p>Добро пожаловать в наше приложение!</p>
      
      <div style={{ margin: '2rem 0' }}>
        <button 
          onClick={() => setCount((count) => count + 1)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Счетчик: {count}
        </button>
      </div>
      
      <p>Это простое React приложение с Vite!</p>
    </div>
  )
}

export default App 