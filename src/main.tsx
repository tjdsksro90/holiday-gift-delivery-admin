import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

/**
 * 백엔드가 아직 없어서 개발 중에는 MSW로 API를 흉내 낸다.
 * 프로덕션 빌드(import.meta.env.DEV === false)에는 아예 포함되지 않는다.
 */
async function enableMocking() {
  if (!import.meta.env.DEV) return
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
