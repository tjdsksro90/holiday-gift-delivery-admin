import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { RevealContactButton } from '@/components/common/RevealContactButton'
import { RoleGuard } from '@/components/common/RoleGuard'
import { OrderTable } from '@/features/orders/components/OrderTable'
import { useOrders } from '@/features/orders/hooks/useOrders'
import { useCustomer } from '../hooks/useCustomer'

export function CustomerDetailPage() {
  const { customerId = '' } = useParams()
  const { data: customer, isLoading, isError } = useCustomer(customerId)
  const { data: orders } = useOrders({ page: 1, pageSize: 10, customerId })

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }
  if (isError || !customer) {
    return <Alert severity="error">고객 정보를 불러오지 못했습니다.</Alert>
  }

  return (
    <Stack spacing={2}>
      <Button
        component={Link}
        to="/customers"
        startIcon={<ArrowBackIcon />}
        sx={{ alignSelf: 'flex-start' }}
      >
        목록으로
      </Button>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="h5">{customer.name}</Typography>
        <Chip size="small" label={customer.membershipTier} />
      </Stack>

      <Typography variant="body2" color="text.secondary">
        연락처: {customer.phoneMasked} · 주소: {customer.addressMasked}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        가입일: {new Date(customer.createdAt).toLocaleDateString()}
      </Typography>

      <RoleGuard allow={['ADMIN', 'CS_AGENT']}>
        <RevealContactButton customerId={customer.id} />
      </RoleGuard>

      <Divider />

      <Typography variant="subtitle1">주문 내역</Typography>
      {orders && orders.items.length > 0 ? (
        <OrderTable orders={orders.items} />
      ) : (
        <Typography variant="body2" color="text.secondary">
          주문 내역이 없습니다.
        </Typography>
      )}
    </Stack>
  )
}
