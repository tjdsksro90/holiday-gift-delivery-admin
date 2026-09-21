import type { CustomerListParams } from '@/types/customer'
import type { OrderListParams } from '@/types/order'

export const queryKeys = {
  customers: {
    list: (params: CustomerListParams) => ['customers', 'list', params] as const,
    detail: (id: string) => ['customers', 'detail', id] as const,
  },
  orders: {
    list: (params: OrderListParams) => ['orders', 'list', params] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
  deliveries: {
    detail: (id: string) => ['deliveries', 'detail', id] as const,
    byOrder: (orderId: string) => ['deliveries', 'by-order', orderId] as const,
  },
}
