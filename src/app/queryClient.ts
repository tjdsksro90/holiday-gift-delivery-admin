import { QueryClient } from '@tanstack/react-query'

/**
 * 캐시는 의도적으로 persist하지 않는다(예: persistQueryClient 미사용).
 * 고객 개인정보가 포함된 응답이 브라우저 스토리지에 남는 것을 막기 위함이며,
 * 탭을 닫으면 메모리 캐시도 함께 사라진다.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
