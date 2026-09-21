import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { fetchInventory } from '../api'

export function useInventory() {
  return useQuery({
    queryKey: queryKeys.inventory.list(),
    queryFn: fetchInventory,
  })
}
