import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// 移除Ant Design样式导入，因为5.x版本不再需要单独导入CSS
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
