import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import type { Delivery } from '@/types/delivery'
import { advanceDelivery, failDelivery } from '../api'

export function useDeliveryStatusActions(orderId: string) {
  const queryClient = useQueryClient()

  function onSuccess(delivery: Delivery) {
    queryClient.setQueryData(queryKeys.deliveries.byOrder(orderId), delivery)
  }

  const advance = useMutation({ mutationFn: () => advanceDelivery(orderId), onSuccess })
  const fail = useMutation({ mutationFn: () => failDelivery(orderId), onSuccess })

  return { advance, fail }
}
