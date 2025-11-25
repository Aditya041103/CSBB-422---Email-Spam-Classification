import React from 'react'
import { createRoot } from 'react-dom/client'
// optional: your custom global styles (if any)
import './app.css';
import './index.css'      // <-- must exist and be imported
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
