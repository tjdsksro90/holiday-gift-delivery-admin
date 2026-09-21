export interface InventoryItem {
  productId: string
  productName: string
  sku: string
  unitPrice: number
  stockQuantity: number
  /** 이 수량 이하로 떨어지면 재고 부족으로 표시한다. */
  safetyStock: number
  updatedAt: string
}

export interface InventoryListResponse {
  items: InventoryItem[]
}

export interface StockAdjustPayload {
  /** 양수면 입고, 음수면 출고/조정. */
  delta: number
  reason: string
}
