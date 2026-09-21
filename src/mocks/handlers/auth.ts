import { HttpResponse, http } from 'msw'
import type { AuthUser } from '@/types/auth'
import { API_BASE } from '../apiBase'
import { TEST_ACCOUNT } from '../testAccount'

const SESSION_KEY = 'mock-session-user'

const MOCK_USER: AuthUser = {
  id: 'emp-1',
  displayName: '홍길동 매니저',
  role: 'ADMIN',
}

function readSession(): AuthUser | null {
  const raw = sessionStorage.getItem(SESSION_KEY)
  return raw ? (JSON.parse(raw) as AuthUser) : null
}

export const authHandlers = [
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { employeeId?: string; password?: string }
    if (
      body.employeeId !== TEST_ACCOUNT.employeeId ||
      body.password !== TEST_ACCOUNT.password
    ) {
      return HttpResponse.json(
        { message: '사번 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 },
      )
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(MOCK_USER))
    return HttpResponse.json(MOCK_USER)
  }),

  http.post(`${API_BASE}/auth/logout`, () => {
    sessionStorage.removeItem(SESSION_KEY)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(`${API_BASE}/auth/me`, () => {
    const user = readSession()
    if (!user) return new HttpResponse(null, { status: 401 })
    return HttpResponse.json(user)
  }),
]
