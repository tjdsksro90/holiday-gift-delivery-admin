import { useMemo } from 'react'
import { useInventory } from './useInventory'

/** 안전재고 이하인 상품 id 집합. 주문 화면에서 재고 부족 상품을 표시할 때 쓴다. */
export function useLowStockProductIds(): Set<string> {
  const { data } = useInventory()

  // data가 실제로 바뀔 때만 다시 계산한다 — 아니면 이 훅을 쓰는 테이블이
  // 리렌더링될 때마다(페이지 이동 등) 매번 새 Set을 만들게 된다.
  return useMemo(
    () =>
      new Set(
        data?.items
          .filter((item) => item.stockQuantity <= item.safetyStock)
          .map((item) => item.productId),
      ),
    [data],
  )
}
