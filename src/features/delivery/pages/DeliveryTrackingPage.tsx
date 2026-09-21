import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { useOrder } from '@/features/orders/hooks/useOrder'
import { useDelivery } from '../hooks/useDelivery'
import { DeliveryTimeline } from '../components/DeliveryTimeline'
import { DeliveryStatusChip } from '../components/DeliveryStatusChip'
import { DeliveryStatusControls } from '../components/DeliveryStatusControls'
import { DeliveryAutoSimulate } from '../components/DeliveryAutoSimulate'

export function DeliveryTrackingPage() {
  const { orderId = '' } = useParams()
  const { data, isLoading, isError } = useDelivery(orderId)
  const { data: order } = useOrder(orderId)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }
  if (isError || !data) {
    return <Alert severity="error">배송 정보를 불러오지 못했습니다.</Alert>
  }

  return (
    <Stack spacing={2}>
      <Button
        component={Link}
        to={`/orders/${orderId}`}
        startIcon={<ArrowBackIcon />}
        sx={{ alignSelf: 'flex-start' }}
      >
        주문 상세로
      </Button>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="h5">배송 조회</Typography>
        <DeliveryStatusChip status={data.status} />
      </Stack>
      {order && (
        <Typography variant="body2" color="text.secondary">
          주문번호: {order.orderNo}
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary">
        {data.courierCompany} · {data.trackingNo}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        수령지: {data.recipientAddressMasked}
      </Typography>

      <DeliveryTimeline events={data.events} />

      <Divider />

      <DeliveryStatusControls delivery={data} />
      <DeliveryAutoSimulate delivery={data} />
    </Stack>
  )
}
