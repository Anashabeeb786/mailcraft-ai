/**
 * main.jsx — React Application Entry Point
 *
 * Renders the root <App /> component into the #root div.
 * Wraps with StrictMode for development warnings.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
