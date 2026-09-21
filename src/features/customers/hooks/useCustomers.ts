import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import type { CustomerListParams } from '@/types/customer'
import { fetchCustomers } from '../api'

export function useCustomers(params: CustomerListParams) {
  return useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: () => fetchCustomers(params),
    placeholderData: (previous) => previous,
  })
}
