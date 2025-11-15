import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// HashRouter для роутинга
import { HashRouter } from 'react-router-dom'

// MaxUI провайдер для стилей и компонентов
import './styles/reset.css'       // сброс браузерных стилей

// import { MaxUI } from '@maxhub/max-ui'
// import '@maxhub/max-ui/dist/styles.css'

import './styles/variables.css'   // переменные, цвета, шрифты
import './styles/index.css'       // глобальные правила (body, h1, ссылки)

// создаём root и рендерим
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <MaxUI platform="android"> */}
      <HashRouter>
        <App />
      </HashRouter>
    {/* </MaxUI> */}
  </React.StrictMode>
)
