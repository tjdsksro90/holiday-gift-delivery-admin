import type { InventoryItem } from '@/types/inventory'
import { PRODUCT_CATALOG } from './products'

const SAFETY_STOCK = 20

function buildInitialInventory(): InventoryItem[] {
  return PRODUCT_CATALOG.map((product, index) => ({
    productId: product.productId,
    productName: product.productName,
    sku: `SKU-${String(index + 1).padStart(4, '0')}`,
    unitPrice: product.unitPrice,
    // 상품 하나는 일부러 안전재고 이하로 시작해서 재고 부족 화면을 바로 확인할 수 있게 한다.
    stockQuantity: index === 0 ? 12 : 30 + index * 15,
    safetyStock: SAFETY_STOCK,
    updatedAt: new Date(2026, 8, 1).toISOString(),
  }))
}

/** 목업 서버 쪽에 보관하는 가변 재고 상태. */
const store = new Map<string, InventoryItem>(
  buildInitialInventory().map((item) => [item.productId, item]),
)

export function listInventory(): InventoryItem[] {
  return Array.from(store.values())
}

export function findInventoryItem(productId: string): InventoryItem | undefined {
  return store.get(productId)
}

interface AdjustResult {
  item: InventoryItem
  ok: boolean
  message?: string
}

export function adjustInventoryStock(
  productId: string,
  delta: number,
): AdjustResult | undefined {
  const item = store.get(productId)
  if (!item) return undefined

  const nextQuantity = item.stockQuantity + delta
  if (nextQuantity < 0) {
    return { item, ok: false, message: '재고 수량은 0보다 작을 수 없습니다' }
  }

  item.stockQuantity = nextQuantity
  item.updatedAt = new Date().toISOString()
  return { item, ok: true }
}
