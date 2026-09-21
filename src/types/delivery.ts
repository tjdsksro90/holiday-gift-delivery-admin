export type DeliveryStatus =
  | 'READY'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'FAILED'

export interface DeliveryTrackingEvent {
  status: DeliveryStatus
  location: string
  occurredAt: string
}

export interface Delivery {
  id: string
  orderId: string
  courierCompany: string
  trackingNo: string
  /** 배송 화면에서만 마스킹 해제된 수령 주소가 필요할 수 있어 마스킹 값을 기본 제공 */
  recipientAddressMasked: string
  status: DeliveryStatus
  events: DeliveryTrackingEvent[]
  estimatedAt: string | null
}
