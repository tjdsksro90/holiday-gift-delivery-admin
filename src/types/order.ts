export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export interface GiftSetItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  orderNo: string
  customerId: string
  customerName: string
  items: GiftSetItem[]
  totalAmount: number
  status: OrderStatus
  deliveryId: string | null
  createdAt: string
}

export interface OrderListParams {
  page: number
  pageSize: number
  status?: OrderStatus
  customerId?: string
}

export interface OrderListResponse {
  items: Order[]
  total: number
}
