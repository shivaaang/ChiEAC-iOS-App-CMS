//
//  main.tsx
//  ChiEAC
//
//  React application entry point and root rendering
//  Created by Shivaang Kumar on 8/16/25.
//

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
