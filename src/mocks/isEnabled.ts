/**
 * 목업(MSW)을 켤지 여부. 개발 서버에서는 항상 켜고,
 * 프로덕션 빌드에서는 기본적으로 꺼져 있다 — 다만 백엔드가 없는 포트폴리오/데모용
 * 배포에서는 VITE_ENABLE_MOCKS=true로 명시적으로 켤 수 있다.
 * "DEV냐 아니냐"가 아니라 "목업으로 동작 중이냐"가 기준이라, DEV 전용이라고
 * 표시했던 화면(테스트 계정 안내, 배송 자동 시뮬레이션)도 이 플래그를 함께 쓴다.
 */
export const MOCKS_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === 'true'
