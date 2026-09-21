import { Alert, Button, Stack, Typography } from '@mui/material'
import { RoleGuard } from '@/components/common/RoleGuard'
import type { Delivery } from '@/types/delivery'
import { useDeliveryStatusActions } from '../hooks/useDeliveryStatusActions'
import {
  DELIVERY_FAILABLE_STATUSES,
  isTerminalDeliveryStatus,
  nextDeliveryStatus,
} from '../statusLabels'

/**
 * 정상 흐름(다음 단계로 진행)은 원래 택배사 웹훅이 자동으로 처리해야 할 일이다.
 * 여기서는 담당자가 예외 상황(오배송 재처리, 배송 실패 등)에 수동으로 개입하는
 * 용도로만 노출한다.
 */
export function DeliveryStatusControls({ delivery }: { delivery: Delivery }) {
  const { advance, fail } = useDeliveryStatusActions(delivery.orderId)
  const canAdvance = nextDeliveryStatus(delivery.status) !== null
  const canFail = DELIVERY_FAILABLE_STATUSES.includes(delivery.status)

  return (
    <RoleGuard allow={['ADMIN', 'DELIVERY_MANAGER']}>
      <Stack spacing={1}>
        <Typography variant="subtitle2">배송 상태 변경 (담당자)</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            disabled={!canAdvance || advance.isPending}
            onClick={() => advance.mutate()}
          >
            다음 단계로 진행
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            disabled={!canFail || fail.isPending}
            onClick={() => fail.mutate()}
          >
            배송 실패 처리
          </Button>
        </Stack>
        {isTerminalDeliveryStatus(delivery.status) && (
          <Alert severity="info" variant="outlined">
            이미 종료된 배송이라 더 이상 상태를 바꿀 수 없습니다.
          </Alert>
        )}
      </Stack>
    </RoleGuard>
  )
}
