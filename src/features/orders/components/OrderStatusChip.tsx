import { Chip, type ChipProps } from '@mui/material'
import type { OrderStatus } from '@/types/order'

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: '접수대기',
  CONFIRMED: '접수확인',
  PACKING: '포장중',
  SHIPPED: '발송완료',
  DELIVERED: '배송완료',
  CANCELLED: '취소',
}

const STATUS_COLOR: Record<OrderStatus, ChipProps['color']> = {
  PENDING: 'default',
  CONFIRMED: 'info',
  PACKING: 'warning',
  SHIPPED: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'error',
}

export function OrderStatusChip({ status }: { status: OrderStatus }) {
  return (
    <Chip size="small" label={STATUS_LABEL[status]} color={STATUS_COLOR[status]} />
  )
}
