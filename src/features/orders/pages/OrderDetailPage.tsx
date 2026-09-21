import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
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
import { useOrder } from '../hooks/useOrder'
import { OrderStatusChip } from '../components/OrderStatusChip'
import { OrderItemsTable } from '../components/OrderItemsTable'

export function OrderDetailPage() {
  const { orderId = '' } = useParams()
  const { data: order, isLoading, isError } = useOrder(orderId)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }
  if (isError || !order) {
    return <Alert severity="error">주문 정보를 불러오지 못했습니다.</Alert>
  }

  return (
    <Stack spacing={2}>
      <Button
        component={Link}
        to="/orders"
        startIcon={<ArrowBackIcon />}
        sx={{ alignSelf: 'flex-start' }}
      >
        목록으로
      </Button>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="h5">{order.orderNo}</Typography>
        <OrderStatusChip status={order.status} />
      </Stack>

      <Typography variant="body2" color="text.secondary">
        주문 고객: {order.customerName} · 주문일시:{' '}
        {new Date(order.createdAt).toLocaleString()}
      </Typography>

      <Divider />

      <OrderItemsTable items={order.items} />

      <Typography variant="subtitle1" sx={{ alignSelf: 'flex-end' }}>
        총 결제금액: {order.totalAmount.toLocaleString()}원
      </Typography>

      {order.deliveryId && (
        <Button
          component={Link}
          to={`/orders/${order.id}/delivery`}
          variant="outlined"
          startIcon={<LocalShippingIcon />}
          sx={{ alignSelf: 'flex-start' }}
        >
          배송 조회
        </Button>
      )}
    </Stack>
  )
}
