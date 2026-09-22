/**
 * 목업 핸들러는 반드시 실제 API origin에만 붙어야 한다.
 * '*'로 시작하는 와일드카드 패턴(예: '*\/orders')은 경로 어디에든 매칭되기 때문에
 * Vite가 서빙하는 소스 파일 요청(예: /src/features/orders/api.ts)까지
 * 가로채 버리는 사고가 났었다. 반드시 이 상수를 붙여서 origin을 고정한다.
 */
// VITE_API_BASE_URL이 없으면(데모 배포 등) 같은 origin을 쓰도록 빈 문자열로 둔다.
// undefined를 그대로 템플릿 리터럴에 넣으면 "undefined/customers"가 되어
// 아무 요청과도 매칭되지 않는다.
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''
