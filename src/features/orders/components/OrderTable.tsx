import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { Order } from '@/types/order'
import { OrderStatusChip } from './OrderStatusChip'

export function OrderTable({ orders }: { orders: Order[] }) {
  const navigate = useNavigate()

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>주문번호</TableCell>
            <TableCell>고객명</TableCell>
            <TableCell align="right">금액</TableCell>
            <TableCell>상태</TableCell>
            <TableCell align="right">배송</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              hover
              onClick={() => navigate(`/orders/${order.id}`)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>{order.orderNo}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell align="right">{order.totalAmount.toLocaleString()}원</TableCell>
              <TableCell>
                <OrderStatusChip status={order.status} />
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  startIcon={<LocalShippingIcon />}
                  disabled={!order.deliveryId}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/orders/${order.id}/delivery`)
                  }}
                >
                  배송 조회
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
