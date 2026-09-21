import { useMutation } from '@tanstack/react-query'
import { revealCustomerContact } from '../api'

/**
 * useMutation은 결과를 전역 캐시에 적재하지 않고 호출한 컴포넌트의
 * 로컬 state로만 흘러가므로, 원본 개인정보가 react-query 캐시에
 * 남지 않는다.
 */
export function useRevealContact() {
  return useMutation({
    mutationFn: ({ customerId, reason }: { customerId: string; reason: string }) =>
      revealCustomerContact(customerId, reason),
  })
}
