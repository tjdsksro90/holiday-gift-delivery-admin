import { useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import type { InventoryItem } from '@/types/inventory'
import { useAdjustStock } from '../hooks/useAdjustStock'

type Direction = 'IN' | 'OUT'

/**
 * 재고 조정은 입고/출고 구분과 사유를 함께 남겨야 한다 — 고객 정보 열람 로그와
 * 같은 이유로, 나중에 수량이 안 맞을 때 추적할 수 있어야 하기 때문이다.
 */
export function StockAdjustDialog({ item }: { item: InventoryItem }) {
  const [open, setOpen] = useState(false)
  const [direction, setDirection] = useState<Direction>('IN')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const { mutate, isPending, isError, reset } = useAdjustStock()

  function handleClose() {
    setOpen(false)
    setQuantity('')
    setReason('')
    reset()
  }

  function handleSubmit() {
    const amount = Number(quantity)
    if (!amount || !reason) return
    const delta = direction === 'IN' ? amount : -amount
    mutate(
      { productId: item.productId, payload: { delta, reason } },
      { onSuccess: handleClose },
    )
  }

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        재고 조정
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{item.productName} 재고 조정</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              select
              label="구분"
              value={direction}
              onChange={(e) => setDirection(e.target.value as Direction)}
            >
              <MenuItem value="IN">입고</MenuItem>
              <MenuItem value="OUT">출고/조정</MenuItem>
            </TextField>
            <TextField
              label="수량"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <TextField
              label="사유"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              multiline
              minRows={2}
            />
            {isError && (
              <Alert severity="error">
                처리하지 못했습니다. 수량/사유를 확인해주세요.
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button
            variant="contained"
            disabled={!quantity || !reason || isPending}
            onClick={handleSubmit}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
