import type { ReactNode } from 'react'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types/auth'

interface RoleGuardProps {
  allow: UserRole[]
  children: ReactNode
  fallback?: ReactNode
}

/**
 * 화면 단 권한 분기는 UX 편의일 뿐 보안 경계가 아니다.
 * 실제 권한 검증은 항상 서버 API에서 다시 수행되어야 한다.
 */
export function RoleGuard({ allow, children, fallback = null }: RoleGuardProps) {
  const role = useAuthStore((state) => state.user?.role)
  if (!role || !allow.includes(role)) return <>{fallback}</>
  return <>{children}</>
}
