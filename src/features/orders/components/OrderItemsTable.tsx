import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { LowStockBadge } from '@/features/inventory/components/LowStockBadge'
import { useLowStockProductIds } from '@/features/inventory/hooks/useLowStockProductIds'
import type { GiftSetItem } from '@/types/order'

export function OrderItemsTable({ items }: { items: GiftSetItem[] }) {
  const lowStockIds = useLowStockProductIds()

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>상품명</TableCell>
            <TableCell align="right">수량</TableCell>
            <TableCell align="right">단가</TableCell>
            <TableCell align="right">소계</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.productId}>
              <TableCell>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <span>{item.productName}</span>
                  {lowStockIds.has(item.productId) && <LowStockBadge />}
                </Stack>
              </TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{item.unitPrice.toLocaleString()}원</TableCell>
              <TableCell align="right">
                {(item.unitPrice * item.quantity).toLocaleString()}원
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
