import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { VemetricScript } from '@vemetric/react'
import './index.css'
import App from './App.tsx'

const vemetricToken = import.meta.env.VITE_VEMETRIC_TOKEN as string | undefined

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {vemetricToken ? (
      <VemetricScript token={vemetricToken} allowCookies={false} trackPageViews />
    ) : null}
    <App />
  </StrictMode>,
)
