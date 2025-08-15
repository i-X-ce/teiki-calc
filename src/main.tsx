import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MantineProviderWrapper from './components/MantineProviderWrapper.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProviderWrapper>
      <App />
    </MantineProviderWrapper>
  </StrictMode>,
)
