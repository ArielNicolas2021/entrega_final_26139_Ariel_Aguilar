import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RoutesProvider } from './routes/RoutesProvider.jsx'
import './styles/App.css'
import './styles/theme.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoutesProvider />
  </StrictMode>,
)
