import { describe, expect, it } from 'vitest'
import { adjustInventoryStock, findInventoryItem, listInventory } from './inventory'

describe('adjustInventoryStock', () => {
  it('입고(양수 delta)만큼 재고가 늘어난다', () => {
    const before = findInventoryItem('set-spam')!.stockQuantity

    const result = adjustInventoryStock('set-spam', 10)

    expect(result?.ok).toBe(true)
    expect(result?.item.stockQuantity).toBe(before + 10)
  })

  it('출고(음수 delta)만큼 재고가 줄어든다', () => {
    const before = findInventoryItem('set-fruit')!.stockQuantity

    const result = adjustInventoryStock('set-fruit', -5)

    expect(result?.ok).toBe(true)
    expect(result?.item.stockQuantity).toBe(before - 5)
  })

  it('결과 수량이 음수가 되는 조정은 거부하고 재고를 그대로 둔다', () => {
    const before = findInventoryItem('set-oil')!.stockQuantity

    const result = adjustInventoryStock('set-oil', -(before + 100))

    expect(result?.ok).toBe(false)
    expect(result?.message).toBeTruthy()
    expect(findInventoryItem('set-oil')!.stockQuantity).toBe(before)
  })

  it('존재하지 않는 상품이면 undefined를 반환한다', () => {
    expect(adjustInventoryStock('no-such-product', 10)).toBeUndefined()
  })

  it('조정에 성공하면 updatedAt이 갱신된다', () => {
    const before = findInventoryItem('set-hanwoo')!.updatedAt

    const result = adjustInventoryStock('set-hanwoo', 1)

    expect(result?.item.updatedAt).not.toBe(before)
  })

  it('조정에 실패하면 updatedAt이 바뀌지 않는다', () => {
    const before = findInventoryItem('set-oil')!.stockQuantity
    const beforeUpdatedAt = findInventoryItem('set-oil')!.updatedAt

    adjustInventoryStock('set-oil', -(before + 100))

    expect(findInventoryItem('set-oil')!.updatedAt).toBe(beforeUpdatedAt)
  })
})

describe('listInventory', () => {
  it('상품 카탈로그의 모든 상품을 반환한다', () => {
    const items = listInventory()
    expect(items.map((item) => item.productId)).toEqual(
      expect.arrayContaining(['set-spam', 'set-fruit', 'set-oil', 'set-hanwoo']),
    )
  })
})
