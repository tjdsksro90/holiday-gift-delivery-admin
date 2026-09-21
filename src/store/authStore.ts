import { create } from 'zustand'
import type { AuthUser } from '@/types/auth'

/**
 * 세션 정보(role 등)만 메모리에 보관한다. persist 미들웨어를 쓰지 않는데,
 * 로그인 상태는 항상 서버 세션(httpOnly 쿠키) 기준으로 새로고침 시 재검증해야
 * 클라이언트 상태 위조로 인한 권한 우회를 막을 수 있기 때문이다.
 */
interface AuthState {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}))
