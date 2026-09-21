import type { Order, OrderStatus } from '@/types/order'
import { rawCustomers } from './customers'
import { PRODUCT_CATALOG } from './products'

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
  const item = PRODUCT_CATALOG[index % PRODUCT_CATALOG.length]
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
