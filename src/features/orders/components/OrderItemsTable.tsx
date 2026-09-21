import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import type { GiftSetItem } from '@/types/order'

export function OrderItemsTable({ items }: { items: GiftSetItem[] }) {
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
              <TableCell>{item.productName}</TableCell>
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
