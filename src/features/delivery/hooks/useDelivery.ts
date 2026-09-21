import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { fetchDeliveryByOrder } from '../api'

export function useDelivery(orderId: string) {
  return useQuery({
    queryKey: queryKeys.deliveries.byOrder(orderId),
    queryFn: () => fetchDeliveryByOrder(orderId),
    enabled: Boolean(orderId),
    // 배송 상태는 자주 바뀌므로 목록/주문 데이터보다 짧게 캐시한다.
    staleTime: 10_000,
  })
}
