export type UserRole = 'ADMIN' | 'CS_AGENT' | 'DELIVERY_MANAGER' | 'VIEWER'

/**
 * 인증 토큰은 httpOnly 쿠키로만 다루고 프론트 상태에는 절대 보관하지 않는다.
 * 여기 담기는 값은 UI 분기(RBAC)를 위한 최소 정보뿐이다.
 */
export interface AuthUser {
  id: string
  displayName: string
  role: UserRole
}
