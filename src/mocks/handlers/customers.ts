import { HttpResponse, http } from 'msw'
import type { CustomerListResponse, CustomerRevealed } from '@/types/customer'
import { API_BASE } from '../apiBase'
import { findMaskedCustomer, findRawCustomer, maskedCustomers } from '../data/customers'

export const customerHandlers = [
  http.get(`${API_BASE}/customers`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '20')
    const keyword = url.searchParams.get('keyword')?.trim()

    const filtered = keyword
      ? maskedCustomers.filter((c) => c.name.includes(keyword))
      : maskedCustomers

    const start = (page - 1) * pageSize
    const body: CustomerListResponse = {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
    }
    return HttpResponse.json(body)
  }),

  http.get(`${API_BASE}/customers/:id`, ({ params }) => {
    const customer = findMaskedCustomer(String(params.id))
    if (!customer) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(customer)
  }),

  http.post(`${API_BASE}/customers/:id/reveal`, async ({ params, request }) => {
    const body = (await request.json()) as { reason?: string }
    if (!body.reason) {
      return HttpResponse.json({ message: '열람 사유가 필요합니다' }, { status: 400 })
    }
    const raw = findRawCustomer(String(params.id))
    if (!raw) return new HttpResponse(null, { status: 404 })

    // eslint-disable-next-line no-console -- 목업 환경에서 감사 로그 흉내
    console.info(`[mock audit log] reveal ${raw.id} reason="${body.reason}"`)

    const revealed: CustomerRevealed = {
      id: raw.id,
      phone: raw.phone,
      address: raw.address,
      revealedAt: new Date().toISOString(),
    }
    return HttpResponse.json(revealed)
  }),
]
