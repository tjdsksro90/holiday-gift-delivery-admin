import { httpClient } from '@/api/httpClient'
import type { Order, OrderListParams, OrderListResponse } from '@/types/order'

export async function fetchOrders(
  params: OrderListParams,
): Promise<OrderListResponse> {
  const { data } = await httpClient.get<OrderListResponse>('/orders', { params })
  return data
}

export async function fetchOrder(id: string): Promise<Order> {
  const { data } = await httpClient.get<Order>(`/orders/${id}`)
  return data
}
