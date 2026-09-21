import { useInventory } from './useInventory'

/** 안전재고 이하인 상품 id 집합. 주문 화면에서 재고 부족 상품을 표시할 때 쓴다. */
export function useLowStockProductIds(): Set<string> {
  const { data } = useInventory()
  return new Set(
    data?.items
      .filter((item) => item.stockQuantity <= item.safetyStock)
      .map((item) => item.productId),
  )
}
