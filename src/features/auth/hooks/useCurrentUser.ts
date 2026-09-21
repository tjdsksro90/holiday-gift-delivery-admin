import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { fetchCurrentUser } from '../api'

/**
 * 앱 로드 시 항상 서버 세션을 재검증한다.
 * 클라이언트에 남아있던 이전 role 정보를 신뢰하지 않는다.
 */
export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser)
  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchCurrentUser,
    retry: false,
  })

  useEffect(() => {
    if (query.data) setUser(query.data)
    if (query.isError) setUser(null)
  }, [query.data, query.isError, setUser])

  return query
}
