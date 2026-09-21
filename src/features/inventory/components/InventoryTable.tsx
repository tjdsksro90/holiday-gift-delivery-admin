import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { RoleGuard } from '@/components/common/RoleGuard'
import type { InventoryItem } from '@/types/inventory'
import { StockAdjustDialog } from './StockAdjustDialog'

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>상품명</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell align="right">현재고</TableCell>
            <TableCell align="right">안전재고</TableCell>
            <TableCell align="right">단가</TableCell>
            <TableCell>상태</TableCell>
            <TableCell align="right">조정</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const low = item.stockQuantity <= item.safetyStock
            return (
              <TableRow key={item.productId} hover>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell align="right">{item.stockQuantity.toLocaleString()}</TableCell>
                <TableCell align="right">{item.safetyStock.toLocaleString()}</TableCell>
                <TableCell align="right">{item.unitPrice.toLocaleString()}원</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={low ? '재고 부족' : '정상'}
                    color={low ? 'error' : 'success'}
                  />
                </TableCell>
                <TableCell align="right">
                  <RoleGuard allow={['ADMIN', 'DELIVERY_MANAGER']}>
                    <StockAdjustDialog item={item} />
                  </RoleGuard>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
