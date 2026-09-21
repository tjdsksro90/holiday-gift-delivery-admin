import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * 실제 백엔드가 붙기 전까지 화면 확인용으로만 사용하는 목업이다.
 * 프로덕션 빌드에는 절대 포함되지 않도록 main.tsx에서 DEV 환경일 때만 로드한다.
 */
export const worker = setupWorker(...handlers)
