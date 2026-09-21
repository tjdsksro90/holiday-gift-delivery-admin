import { httpClient } from '@/api/httpClient'
import type {
  Customer,
  CustomerListParams,
  CustomerListResponse,
  CustomerRevealed,
} from '@/types/customer'

export async function fetchCustomers(
  params: CustomerListParams,
): Promise<CustomerListResponse> {
  const { data } = await httpClient.get<CustomerListResponse>('/customers', {
    params,
  })
  return data
}

export async function fetchCustomer(id: string): Promise<Customer> {
  const { data } = await httpClient.get<Customer>(`/customers/${id}`)
  return data
}

/**
 * 마스킹 해제 API. 호출 즉시 서버 접근 로그가 남는다.
 * 응답 값은 어떤 캐시/스토어에도 저장하지 말고 호출 지점에서만 사용할 것.
 */
export async function revealCustomerContact(
  customerId: string,
  reason: string,
): Promise<CustomerRevealed> {
  const { data } = await httpClient.post<CustomerRevealed>(
    `/customers/${customerId}/reveal`,
    { reason },
  )
  return data
}
