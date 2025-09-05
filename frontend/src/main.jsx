import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import appIcon from './components/icon.png'

// Ensure favicon uses our project icon (works in dev and build)
const ensureFavicon = () => {
  const link = document.querySelector("link[rel='icon']") || document.createElement('link')
  link.setAttribute('rel', 'icon')
  link.setAttribute('type', 'image/png')
  link.setAttribute('href', appIcon)
  if (!link.parentNode) {
    document.head.appendChild(link)
  }
}
ensureFavicon()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
