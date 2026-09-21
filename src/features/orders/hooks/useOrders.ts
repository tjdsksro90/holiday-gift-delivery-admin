import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import type { OrderListParams } from '@/types/order'
import { fetchOrders } from '../api'

export function useOrders(params: OrderListParams) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => fetchOrders(params),
    placeholderData: (previous) => previous,
  })
}
