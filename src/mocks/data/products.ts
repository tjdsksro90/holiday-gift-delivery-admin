import type { GiftSetItem } from '@/types/order'

/**
 * 주문 목업(orders.ts)과 재고 목업(inventory.ts)이 같은 상품 카탈로그를 공유한다.
 * 상품이 늘어나면 여기 한 곳만 수정하면 된다.
 */
export const PRODUCT_CATALOG: GiftSetItem[] = [
  {
    productId: 'set-spam',
    productName: '스팸 선물세트 26호',
    quantity: 1,
    unitPrice: 45_000,
  },
  {
    productId: 'set-fruit',
    productName: '과일 선물세트',
    quantity: 1,
    unitPrice: 68_000,
  },
  {
    productId: 'set-oil',
    productName: '식용유 선물세트',
    quantity: 1,
    unitPrice: 39_000,
  },
  {
    productId: 'set-hanwoo',
    productName: '한우 선물세트',
    quantity: 1,
    unitPrice: 180_000,
  },
]
