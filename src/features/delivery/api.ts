import { httpClient } from '@/api/httpClient'
import type { Delivery } from '@/types/delivery'

export async function fetchDeliveryByOrder(orderId: string): Promise<Delivery> {
  const { data } = await httpClient.get<Delivery>(`/orders/${orderId}/delivery`)
  return data
}

/**
 * 실제 서비스에서는 이 엔드포인트를 사람이 아니라 택배사 웹훅이 호출한다.
 * 여기서는 배송 실패 재처리 등 예외 상황을 담당자가 수동으로 넘길 때만 쓴다.
 */
export async function advanceDelivery(orderId: string): Promise<Delivery> {
  const { data } = await httpClient.post<Delivery>(`/orders/${orderId}/delivery/advance`)
  return data
}

export async function failDelivery(orderId: string): Promise<Delivery> {
  const { data } = await httpClient.post<Delivery>(`/orders/${orderId}/delivery/fail`)
  return data
}
