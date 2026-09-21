import { httpClient } from '@/api/httpClient'
import type {
  InventoryItem,
  InventoryListResponse,
  StockAdjustPayload,
} from '@/types/inventory'

export async function fetchInventory(): Promise<InventoryListResponse> {
  const { data } = await httpClient.get<InventoryListResponse>('/inventory')
  return data
}

export async function adjustStock(
  productId: string,
  payload: StockAdjustPayload,
): Promise<InventoryItem> {
  const { data } = await httpClient.post<InventoryItem>(
    `/inventory/${productId}/adjust`,
    payload,
  )
  return data
}
