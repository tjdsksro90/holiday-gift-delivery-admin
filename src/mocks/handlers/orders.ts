import { HttpResponse, http } from 'msw'
import type { OrderListResponse, OrderStatus } from '@/types/order'
import { API_BASE } from '../apiBase'
import { findOrder, orders } from '../data/orders'

export const orderHandlers = [
  http.get(`${API_BASE}/orders`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '20')
    const status = url.searchParams.get('status') as OrderStatus | null
    const customerId = url.searchParams.get('customerId')

    const filtered = orders
      .filter((o) => !status || o.status === status)
      .filter((o) => !customerId || o.customerId === customerId)

    const start = (page - 1) * pageSize
    const body: OrderListResponse = {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
    }
    return HttpResponse.json(body)
  }),

  http.get(`${API_BASE}/orders/:id`, ({ params }) => {
    const order = findOrder(String(params.id))
    if (!order) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(order)
  }),
]
