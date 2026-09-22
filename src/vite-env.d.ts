/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  /** 'true'면 프로덕션 빌드에서도 MSW 목업을 켠다 (백엔드 없는 데모 배포용). */
  readonly VITE_ENABLE_MOCKS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
