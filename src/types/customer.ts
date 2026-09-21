/**
 * 고객 정보는 목록/카드 등 일반 화면에서는 항상 마스킹된 상태로 노출된다.
 * 마스킹 해제(reveal)가 필요한 화면은 별도 API(`/customers/:id/reveal`)를 호출해
 * 서버에서 열람 권한과 접근 로그를 남긴 뒤 원본 값을 내려받는다.
 * 즉, 마스킹 해제된 원본 값은 클라이언트 상태(zustand, react-query 캐시)에
 * 영구 저장하지 않고 해당 화면 렌더링 동안만 메모리에 유지한다.
 */
export interface Customer {
  id: string
  name: string
  /** 마스킹된 전화번호, 예: 010-****-5678 */
  phoneMasked: string
  /** 마스킹된 주소, 예: 서울시 강남구 ***** */
  addressMasked: string
  membershipTier: MembershipTier
  createdAt: string
}

export type MembershipTier = 'GENERAL' | 'SILVER' | 'GOLD' | 'VIP'

export interface CustomerRevealed {
  id: string
  phone: string
  address: string
  /** 열람 감사 로그에 사용되는 발급 시각 */
  revealedAt: string
}

export interface CustomerListParams {
  page: number
  pageSize: number
  keyword?: string
}

export interface CustomerListResponse {
  items: Customer[]
  total: number
}
