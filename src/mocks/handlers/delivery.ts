import { HttpResponse, http } from 'msw'
import { API_BASE } from '../apiBase'
import { advanceDelivery, failDelivery, getDelivery } from '../data/deliveries'

export const deliveryHandlers = [
  http.get(`${API_BASE}/orders/:orderId/delivery`, ({ params }) => {
    const delivery = getDelivery(String(params.orderId))
    if (!delivery) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(delivery)
  }),

  http.post(`${API_BASE}/orders/:orderId/delivery/advance`, ({ params }) => {
    const result = advanceDelivery(String(params.orderId))
    if (!result) return new HttpResponse(null, { status: 404 })
    if (!result.changed) {
      return HttpResponse.json(
        { message: '더 이상 진행할 단계가 없습니다' },
        { status: 409 },
      )
    }
    return HttpResponse.json(result.delivery)
  }),

  http.post(`${API_BASE}/orders/:orderId/delivery/fail`, ({ params }) => {
    const result = failDelivery(String(params.orderId))
    if (!result) return new HttpResponse(null, { status: 404 })
    if (!result.changed) {
      return HttpResponse.json(
        { message: '현재 상태에서는 실패 처리할 수 없습니다' },
        { status: 409 },
      )
    }
    return HttpResponse.json(result.delivery)
  }),
]
