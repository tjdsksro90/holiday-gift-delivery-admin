import type { GiftSetItem, Order, OrderStatus } from '@/types/order'
import { rawCustomers } from './customers'

const CATALOG: GiftSetItem[] = [
  { productId: 'set-spam', productName: '스팸 선물세트 26호', quantity: 1, unitPrice: 45_000 },
  { productId: 'set-fruit', productName: '과일 선물세트', quantity: 1, unitPrice: 68_000 },
  { productId: 'set-oil', productName: '식용유 선물세트', quantity: 1, unitPrice: 39_000 },
  { productId: 'set-hanwoo', productName: '한우 선물세트', quantity: 1, unitPrice: 180_000 },
]

const STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PACKING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

function buildOrder(index: number): Order {
  const customer = rawCustomers[index % rawCustomers.length]
  const item = CATALOG[index % CATALOG.length]
  const status = STATUSES[index % STATUSES.length]
  const hasDelivery = status === 'SHIPPED' || status === 'DELIVERED'
  return {
    id: `order-${index + 1}`,
    orderNo: `ORD-2026-${String(index + 1).padStart(5, '0')}`,
    customerId: customer.id,
    customerName: customer.name,
    items: [item],
    totalAmount: item.unitPrice * item.quantity,
    status,
    deliveryId: hasDelivery ? `delivery-${index + 1}` : null,
    createdAt: new Date(2026, 8, 1 + (index % 20)).toISOString(),
  }
}

export const orders: Order[] = Array.from({ length: 63 }, (_, i) => buildOrder(i))

export function findOrder(id: string): Order | undefined {
  return orders.find((o) => o.id === id)
}
