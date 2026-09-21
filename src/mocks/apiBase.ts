/**
 * 목업 핸들러는 반드시 실제 API origin에만 붙어야 한다.
 * '*'로 시작하는 와일드카드 패턴(예: '*\/orders')은 경로 어디에든 매칭되기 때문에
 * Vite가 서빙하는 소스 파일 요청(예: /src/features/orders/api.ts)까지
 * 가로채 버리는 사고가 났었다. 반드시 이 상수를 붙여서 origin을 고정한다.
 */
export const API_BASE = import.meta.env.VITE_API_BASE_URL
