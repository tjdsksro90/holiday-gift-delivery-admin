import { Chip } from '@mui/material'
import type { DeliveryStatus } from '@/types/delivery'
import { DELIVERY_STATUS_LABEL } from '../statusLabels'

export function DeliveryStatusChip({ status }: { status: DeliveryStatus }) {
  return (
    <Chip
      size="small"
      label={DELIVERY_STATUS_LABEL[status]}
      color={
        status === 'FAILED' ? 'error' : status === 'COMPLETED' ? 'success' : 'default'
      }
    />
  )
}
