import { maskAddress } from '@/utils/mask'
import {
  DELIVERY_STATUS_FLOW,
  DELIVERY_FAILABLE_STATUSES,
  nextDeliveryStatus,
} from '@/features/delivery/statusLabels'
import type { Delivery, DeliveryStatus, DeliveryTrackingEvent } from '@/types/delivery'
import { findOrder } from './orders'
import { findRawCustomer } from './customers'

const COURIERS = ['CJ대한통운', '한진택배', '롯데택배']

const LOCATION_BY_STATUS: Record<DeliveryStatus, string> = {
  READY: '물류센터',
  PICKED_UP: '허브터미널',
  IN_TRANSIT: '간선 이동 중',
  OUT_FOR_DELIVERY: '지역 배송 캠프',
  COMPLETED: '수령지',
  FAILED: '배송 실패 처리',
}

/** 주문/배송 상태는 서버(목업) 쪽에 보관하는 가변 상태다 — GET할 때마다 새로 계산하지 않는다. */
const store = new Map<string, Delivery>()

function buildInitialDelivery(orderId: string): Delivery | undefined {
  const order = findOrder(orderId)
  if (!order || !order.deliveryId) return undefined
  const customer = findRawCustomer(order.customerId)

  const stepCount = order.status === 'DELIVERED' ? DELIVERY_STATUS_FLOW.length : 3
  const events: DeliveryTrackingEvent[] = DELIVERY_STATUS_FLOW.slice(0, stepCount)
    .map((status, i) => ({
      status,
      location: LOCATION_BY_STATUS[status],
      occurredAt: new Date(2026, 8, 20 + i).toISOString(),
    }))
    .reverse()

  return {
    id: order.deliveryId,
    orderId: order.id,
    courierCompany: COURIERS[Number(order.id.split('-')[1]) % COURIERS.length],
    trackingNo: `T${order.id.split('-')[1].padStart(10, '0')}`,
    recipientAddressMasked: maskAddress(customer?.address ?? ''),
    status: events[0]?.status ?? 'READY',
    events,
    estimatedAt:
      events[0]?.status === 'COMPLETED' ? null : new Date(2026, 8, 25).toISOString(),
  }
}

export function getDelivery(orderId: string): Delivery | undefined {
  if (!store.has(orderId)) {
    const initial = buildInitialDelivery(orderId)
    if (!initial) return undefined
    store.set(orderId, initial)
  }
  return store.get(orderId)
}

interface TransitionResult {
  delivery: Delivery
  changed: boolean
}

function pushEvent(delivery: Delivery, status: DeliveryStatus) {
  delivery.status = status
  delivery.events = [
    {
      status,
      location: LOCATION_BY_STATUS[status],
      occurredAt: new Date().toISOString(),
    },
    ...delivery.events,
  ]
  if (status === 'COMPLETED') delivery.estimatedAt = null
}

export function advanceDelivery(orderId: string): TransitionResult | undefined {
  const delivery = getDelivery(orderId)
  if (!delivery) return undefined
  const next = nextDeliveryStatus(delivery.status)
  if (!next) return { delivery, changed: false }
  pushEvent(delivery, next)
  return { delivery, changed: true }
}

export function failDelivery(orderId: string): TransitionResult | undefined {
  const delivery = getDelivery(orderId)
  if (!delivery) return undefined
  if (!DELIVERY_FAILABLE_STATUSES.includes(delivery.status)) {
    return { delivery, changed: false }
  }
  pushEvent(delivery, 'FAILED')
  return { delivery, changed: true }
}
