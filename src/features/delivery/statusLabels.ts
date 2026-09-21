import type { DeliveryStatus } from '@/types/delivery'

export const DELIVERY_STATUS_LABEL: Record<DeliveryStatus, string> = {
  READY: '집화 대기',
  PICKED_UP: '집화 완료',
  IN_TRANSIT: '간선 이동중',
  OUT_FOR_DELIVERY: '배송 출발',
  COMPLETED: '배송 완료',
  FAILED: '배송 실패',
}

/** 정상 흐름의 순서. FAILED는 이 흐름을 벗어나는 별도 분기라 포함하지 않는다. */
export const DELIVERY_STATUS_FLOW: DeliveryStatus[] = [
  'READY',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'COMPLETED',
]

/** FAILED로 전환 가능한 상태. READY(집화 전)와 종료 상태에서는 실패 처리를 할 수 없다. */
export const DELIVERY_FAILABLE_STATUSES: DeliveryStatus[] = [
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
]

export function nextDeliveryStatus(status: DeliveryStatus): DeliveryStatus | null {
  const index = DELIVERY_STATUS_FLOW.indexOf(status)
  if (index === -1 || index >= DELIVERY_STATUS_FLOW.length - 1) return null
  return DELIVERY_STATUS_FLOW[index + 1]
}

export function isTerminalDeliveryStatus(status: DeliveryStatus): boolean {
  return status === 'COMPLETED' || status === 'FAILED'
}
