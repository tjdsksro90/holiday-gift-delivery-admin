import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { fetchCustomer } from '../api'

export function useCustomer(customerId: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(customerId),
    queryFn: () => fetchCustomer(customerId),
    enabled: Boolean(customerId),
  })
}
