import { httpClient } from '@/api/httpClient'
import type { AuthUser } from '@/types/auth'

export interface LoginPayload {
  employeeId: string
  password: string
}

/**
 * 로그인 성공 시 서버가 Set-Cookie로 httpOnly 세션 쿠키를 내려준다.
 * 응답 바디에는 화면 분기용 사용자 정보만 담겨 있고 토큰은 없다.
 */
export async function login(payload: LoginPayload): Promise<AuthUser> {
  const { data } = await httpClient.post<AuthUser>('/auth/login', payload)
  return data
}

export async function logout(): Promise<void> {
  await httpClient.post('/auth/logout')
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await httpClient.get<AuthUser>('/auth/me')
  return data
}
