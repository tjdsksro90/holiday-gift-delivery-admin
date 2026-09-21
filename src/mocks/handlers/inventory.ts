import { HttpResponse, http } from 'msw'
import type { InventoryListResponse } from '@/types/inventory'
import { API_BASE } from '../apiBase'
import { adjustInventoryStock, listInventory } from '../data/inventory'

export const inventoryHandlers = [
  http.get(`${API_BASE}/inventory`, () => {
    const body: InventoryListResponse = { items: listInventory() }
    return HttpResponse.json(body)
  }),

  http.post(`${API_BASE}/inventory/:productId/adjust`, async ({ params, request }) => {
    const body = (await request.json()) as { delta?: number; reason?: string }
    if (!body.reason || typeof body.delta !== 'number' || body.delta === 0) {
      return HttpResponse.json(
        { message: '조정 수량과 사유를 모두 입력해야 합니다' },
        { status: 400 },
      )
    }

    const result = adjustInventoryStock(String(params.productId), body.delta)
    if (!result) return new HttpResponse(null, { status: 404 })
    if (!result.ok) {
      return HttpResponse.json({ message: result.message }, { status: 400 })
    }

    // eslint-disable-next-line no-console -- 목업 환경에서 재고 조정 감사 로그 흉내
    console.info(
      `[mock audit log] inventory adjust ${params.productId} delta=${body.delta} reason="${body.reason}"`,
    )

    return HttpResponse.json(result.item)
  }),
]
