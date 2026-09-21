import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import type {
  InventoryItem,
  InventoryListResponse,
  StockAdjustPayload,
} from '@/types/inventory'
import { adjustStock } from '../api'

export function useAdjustStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string
      payload: StockAdjustPayload
    }) => adjustStock(productId, payload),
    onSuccess: (updated: InventoryItem) => {
      queryClient.setQueryData<InventoryListResponse>(
        queryKeys.inventory.list(),
        (prev) =>
          prev
            ? {
                items: prev.items.map((item) =>
                  item.productId === updated.productId ? updated : item,
                ),
              }
            : prev,
      )
    },
  })
}
