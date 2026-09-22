import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { MOCKS_ENABLED } from './mocks/isEnabled'

/**
 * 백엔드가 아직 없어서 MSW로 API를 흉내 낸다. 개발 서버에서는 항상 켜고,
 * 프로덕션 빌드는 MOCKS_ENABLED가 true일 때만(데모 배포용) 동적으로 불러온다 —
 * 일반적인 프로덕션 빌드에는 이 코드 자체가 번들에 포함되지 않는다.
 */
async function enableMocking() {
  if (!MOCKS_ENABLED) return
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

// 목업이 켜지지 않았거나, 어떤 이유로든(서비스워커 등록 실패 등) 시작에
// 실패해도 앱은 반드시 렌더링돼야 한다 — .catch() 없이 .then()만 있으면
// 여기서 reject된 프로미스가 영원히 처리되지 않아 화면이 그대로 비어버린다.
enableMocking()
  .catch((error: unknown) => {
    console.error('[mocks] 목업 초기화 실패, 목업 없이 계속 진행합니다', error)
  })
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
